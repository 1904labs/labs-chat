import DEFAULT_LOG_STRUCTURE from "@/constants/logStructure";
import { BedrockChat } from "@langchain/community/chat_models/bedrock";

export const getModel = () =>
  new BedrockChat({
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

/**
 * Reformats the claude 3 style response data chunk into something we can use 
 * on the frontend based on the default log structure
 * @param {Object} chunkValueAsObject - An object that can be passed in by an iterator
 * but it needs to be converted to JSON.parse(JSON.stringify(obj)) first as necessary.
 * @returns {string} - The formatted bedrock data chunk as a JSON string.
 */
export const formatClaude3DataChunk = (chunkValueAsObject) => {
  let finalReformatted = {
    ...DEFAULT_LOG_STRUCTURE,
  };

  // the message always has a kwargs but it may be mostly empty
  const { kwargs } = chunkValueAsObject;
  // the kwargs always has a response_metadata and content 
  // but the rest of the values are missing on most of the responses 
  // except for the first and the last
  const { response_metadata, content } = kwargs;

  finalReformatted.content = content;

  // the stop reason only shows up on the first and last messages 
  // that will pass through this function. We'll try to capture it where we can
  finalReformatted.stop_reason = response_metadata.stop_reason ?? null;

  // the input and output tokens are only available on the first and last messages
  // and the most accurate tokens are going to be in the invocationMetrics that 
  // only show up within the last chunk from the claude3 messages
  if (
    response_metadata &&
    response_metadata["amazon-bedrock-invocationMetrics"]
  ) {
    const metrics = response_metadata["amazon-bedrock-invocationMetrics"];
    finalReformatted.input_tokens = metrics.inputTokenCount ?? 0;
    finalReformatted.output_tokens = metrics.outputTokenCount ?? 0;
    finalReformatted.stop_reason = metrics.stop_reason ?? null;
  }

  // we need to return a string for the ReadableStream to work
  // this could possibly be controlled or done by the calling
  // entity at a later time
  return JSON.stringify({
    ...finalReformatted,
  });
};
