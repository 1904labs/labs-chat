"use server";

import { InvokeModelWithResponseStreamCommand } from "@aws-sdk/client-bedrock-runtime";
import { formatClaude3DataChunk, getClient } from "@helpers/bedrock";
import { Memory } from "@helpers/memory";
import { getSystemPrompt } from "@helpers/system-prompt";

import { dynamoDBDocumentClient } from "@helpers/aws";

import { PutCommand } from "@aws-sdk/lib-dynamodb";

const fakeSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// aquire the system prompt from the s3 bucket
const systemPrompt = await getSystemPrompt(process.env.SYSTEM_PROMPT_FILE);

// create a memory object to store the context for the conversation
// we will need to keep track to which session this applies
const memory = new Memory(false, systemPrompt, process.env.SYSTEM_PROMPT_FILE);

export async function newChat(user_id) {
  memory.newSession(user_id)
}

export async function newChat(user_id) {
  memory.newSession(user_id)
}

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
        // append the final message to the context
        memory.commitAIStream();

        // save to dynamodb
        const command = new PutCommand({
          TableName: process.env.DYNAMODB_TABLE_NAME,
          Item: memory.getDynamoDBSession(),
        });
        await dynamoDBDocumentClient.send(command);

        controller.close();
      } else {
        // Format the chunk to be a valid JSON string
        const cleanChunk = formatClaude3DataChunk(
          JSON.parse(new TextDecoder().decode(value)),
        );

        // append the chunk to the ai stream accumulator
        const valueString = JSON.parse(cleanChunk);
        if (valueString.model_response) {
          memory.accumulateAIStream(valueString.model_response);
        }
        valueString.system_prompt = memory.getSystemPrompt();
        controller.enqueue(JSON.stringify(valueString));
      }
    },
  });
}

async function* makeIterator(stream) {
  for await (let item of stream.body) {
    yield item.chunk.bytes;
  }
}

export async function POST(req, res) {
  try {
    const request = await req.json();
    //append the human message to the context
    memory.addHumanMessage(request.input);
    const body = {
      anthropic_version: "bedrock-2023-05-31", // todo move to config (yaml merge with env) treat these as kwargs so individual model cards can define their settings
      max_tokens: 4096, // same as above
      system: memory.getSystemPrompt,
      messages: memory.getContext(),
      temperature: parseFloat(process.env.MODEL_TEMPERATURE),
    };
    const jsonBody = JSON.stringify(body);
    const encodedBody = new TextEncoder().encode(jsonBody);
    const invokeInput = {
      body: encodedBody,
      contentType: "application/json",
      accept: "application/json",
      modelId: process.env.MODEL,
    };
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/bedrock-runtime/command/InvokeModelWithResponseStreamCommand/
    const bedrockCommand = new InvokeModelWithResponseStreamCommand(
      invokeInput,
    );
    const stream = await getClient().send(bedrockCommand);
    const iterator = makeIterator(stream);
    const iteratorStream = iteratorToStream(iterator);
    return new Response(iteratorStream);
  } catch (error) {
    console.error("Error:", error);
    return new Response(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
