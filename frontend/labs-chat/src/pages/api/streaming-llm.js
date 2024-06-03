"use server";
import { BedrockRuntimeClient, BedrockeRuntimeClient, InvokeModelWithResponseStreamCommand } from "@aws-sdk/client-bedrock-runtime";
import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { NextResponse } from "next/server";
import { HumanMessage } from "@langchain/core/messages";

import { ChatPromptTemplate } from "@langchain/core/prompts";

const fakeSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const bedrockConfig = {
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  }
};
const bedrockClient = new BedrockRuntimeClient(bedrockConfig);
const model = new BedrockChat({
  model: process.env.MODEL,
  region: "us-east-1",
  streaming: true,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  },
  temperature: Number(process.env.MODEL_TEMPERATURE),
});

const encoder = new TextEncoder();
function iteratorToStream(iterator) {
  return new ReadableStream({
    async pull(controller) {

      // stream returns an interator that is not 
      // stringified or encoded. we need to do both to put them 
      // into a proper stream format
      const chunk = await iterator.next();

      const { value, done } = chunk;

      // classic fake sleep issue to keep multiple chunks
      // from coming through at the same time lawlz
      await fakeSleep(10);
      
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

async function* makeIterator(stream) {
  for await (let item of stream.body){
    yield item.chunk.bytes;
  }
}

// this is just to simulate the API response
// we are not actually doing this anyway
// edge is required to return a streaming response
export const runtime = "edge";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return new Response(null, { status: 404, statusText: "Not Found" });
  }

  try {
    const request = await req.json();    
    const input = {role: "user", content: request.input};
    const body = {
      anthropic_version: "bedrock-2023-05-31", // todo move to config (yaml merge with env) treat these as kwargs so individual model cards can define their settings
      max_tokens: 4096, // same as above
      system: process.env.SYSTEM_PROMPT,
      messages: [input],
      temperature: parseFloat(process.env.MODEL_TEMPERATURE),
    };
    const jsonBody = JSON.stringify(body);
    const encodedBody = new TextEncoder().encode(jsonBody)
    const invokeInput = {
      body: encodedBody,
      contentType: "application/json",
      accept: "application/json",
      modelId: process.env.MODEL,
    };
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/bedrock-runtime/command/InvokeModelWithResponseStreamCommand/
    const bedrockCommand = new InvokeModelWithResponseStreamCommand(invokeInput);
    const stream = await bedrockClient.send(bedrockCommand);
    const iterator = makeIterator(stream);
    const iteratorStream = iteratorToStream(iterator);
    return new Response(iteratorStream);
  } catch (error) {
    console.error("Error:", error);
    return new Response(null, { status: 500, statusText: "Internal Server Error" });
  }
}
