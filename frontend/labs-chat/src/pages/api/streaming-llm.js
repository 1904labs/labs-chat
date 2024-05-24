"use server";
import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { NextResponse } from "next/server";
import { HumanMessage } from "@langchain/core/messages";

import { ChatPromptTemplate } from "@langchain/core/prompts";

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
      const strChunkValue = JSON.stringify(chunk.value);
      const encodedValue = encoder.encode(strChunkValue);
      const encoded = { ...chunk, value: encodedValue };

      const { value, done } = encoded;
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
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
    const input = request.input;
    const iteratorBaseChunks = await model.stream([new HumanMessage({ content: input })]);
    const stream = iteratorToStream(iteratorBaseChunks);
    return new NextResponse(stream);
  } catch (error) {
    console.error("Error:", error);
    return new Response(null, { status: 500, statusText: "Internal Server Error" });
  }
}
