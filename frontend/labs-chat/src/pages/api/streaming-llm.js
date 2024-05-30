"use server";
import { HumanMessage } from "@langchain/core/messages";
import { formatClaude3DataChunk, getModel } from "@/helpers/bedrock";

const fakeSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function iteratorToStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      // stream returns an interator that is not
      // stringified or encoded. we need to do both to put them
      // into a proper stream format
      const chunk = await iterator.next();
      const strChunkValue = JSON.stringify(chunk.value);
      const stringResponse = { ...chunk, value: strChunkValue };

      const { value, done } = stringResponse;

      // classic fake sleep issue to keep multiple chunks
      // from coming through at the same time lawlz
      await fakeSleep(10);

      if (done) {
        controller.close();
      } else {
        const cleanChunk = formatClaude3DataChunk(JSON.parse(value));
        controller.enqueue(cleanChunk);
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
    const iteratorBaseChunks = await getModel().stream([
      new HumanMessage({ content: input }),
    ]);
    const stream = iteratorToStream(iteratorBaseChunks);
    return new Response(stream);
  } catch (error) {
    console.error("Error:", error);
    return new Response(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
