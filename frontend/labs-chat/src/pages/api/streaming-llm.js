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
        // todo: append the final message to the context with ai prefix
        add_ai_message(ai_stream);
        // reset the ai stream
        ai_stream = "";

        controller.close();
      } else {
        // append the chunk to the ai stream
        const cleanChunk = formatClaude3DataChunk(JSON.parse(value));
        const valueString = JSON.parse(cleanChunk);
        accumulate_ai_stream(valueString.content);
        controller.enqueue(cleanChunk);
      }
    },
  });
}

const human_prefix = "Human: ";
const ai_prefix = "AI: ";
let history = "";
add_human_message = (message) => {
  // potentially limit context size
  history += human_prefix + message + "\n\n";
}
add_ai_message = (message) => {
  // potentially limit context size
  history += ai_prefix + message + "\n\n";
}
let ai_stream = "";
accumulate_ai_stream = (chunk) => {
  ai_stream += chunk;
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

    //append the human message to the context

    const input = request.input;
    add_human_message(input);
    console.log("input:", input);
    console.log("history:", history);

    const iteratorBaseChunks = await getModel().stream([
      // todo pass in entire context, with a human prefix
      new HumanMessage({ content: history }),
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
