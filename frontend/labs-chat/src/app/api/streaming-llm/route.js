"use server";

import { InvokeModelWithResponseStreamCommand } from "@aws-sdk/client-bedrock-runtime";
import { formatClaude3DataChunk, getClient } from "@helpers/bedrock";
import { getMemory } from "@helpers/memory";
import { dynamoDBDocumentClient } from "@helpers/aws";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { authenticatedUser } from "@helpers/amplify-server-utils";
import { cookies } from "next/headers";
import { getConfiguredSystemPrompt } from "@helpers/system-prompt";

const fakeSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function iteratorToStream(iterator, MEMORY) {
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
        MEMORY.commitAIStream();

        // save conversation to s3
        await MEMORY.storeConversation();

        // save to dynamodb
        const command = new PutCommand({
          TableName: process.env.DYNAMODB_TABLE_NAME,
          Item: MEMORY.getDynamoDBSession(),
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
          MEMORY.accumulateAIStream(valueString.model_response);
        }
        valueString.system_prompt = MEMORY.getSessionSystemPrompt();
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

/*
 If a session isn't found, use the current user to create a new one.
 This typically happens when a user starts a conversation without clicking
 New Chat or loading a past session.
*/
async function ensureSession(MEMORY) {
  if (!MEMORY.getSession()) {
    const user = await authenticatedUser({ cookies });
    const system_prompt = getConfiguredSystemPrompt();
    MEMORY.newSession(user.userId, system_prompt);
  }
}

export async function POST(req, res) {
  const MEMORY = await getMemory();
  await ensureSession(MEMORY);
  try {
    const request = await req.json();
    //append the human message to the context
    MEMORY.addHumanMessage(request.input);
    const body = {
      anthropic_version: "bedrock-2023-05-31", // todo move to config (yaml merge with env) treat these as kwargs so individual model cards can define their settings
      max_tokens: 4096, // same as above
      system: MEMORY.getSessionSystemPrompt,
      messages: MEMORY.getContext(),
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
    const iteratorStream = iteratorToStream(iterator, MEMORY);
    return new Response(iteratorStream);
  } catch (error) {
    console.error("Error:", error);
    return new Response(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
