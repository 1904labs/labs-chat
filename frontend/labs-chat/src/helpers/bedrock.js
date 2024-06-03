import DEFAULT_LOG_STRUCTURE from "@/constants/logStructure";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

export const getClient = () =>
  new BedrockRuntimeClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: process.env.AWS_SESSION_TOKEN,
    },
  })

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

  // These chunk values match the messages api for anthropic: https://docs.anthropic.com/en/api/messages-streaming#basic-streaming-request 
  const { type } = chunkValueAsObject;
  switch (type) {
    case "content_block_delta":
      const { delta: contentDelta } = chunkValueAsObject;
      const content = contentDelta.text;
      finalReformatted.model_response = content;
      break;
    case "message_delta": 
      const { delta: messageDelta } = chunkValueAsObject;
      finalReformatted.stop_reason = messageDelta.stop_reason;
      break;
    case "message_stop":
      const { "amazon-bedrock-invocationMetrics": invocationMetrics } = chunkValueAsObject;
      const { inputTokenCount, outputTokenCount} = invocationMetrics;
      finalReformatted.input_tokens = inputTokenCount;
      finalReformatted.output_tokens = outputTokenCount;
      break;
  }

  // we need to return a string for the ReadableStream to work
  // this could possibly be controlled or done by the calling
  // entity at a later time
  return JSON.stringify({
    ...finalReformatted,
  });
};
