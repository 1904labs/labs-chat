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

export const formatBedrockDataChunk = (chunkValueAsObject) => {
  let finalReformatted = {
    ...DEFAULT_LOG_STRUCTURE,
  };

  const { kwargs } = chunkValueAsObject;
  const { response_metadata, content } = kwargs;

  finalReformatted.content = content;
  finalReformatted.stop_reason = response_metadata.stop_reason ?? null;

  if (
    response_metadata &&
    response_metadata["amazon-bedrock-invocationMetrics"]
  ) {
    const metrics = response_metadata["amazon-bedrock-invocationMetrics"];
    finalReformatted.input_tokens = metrics.inputTokenCount ?? 0;
    finalReformatted.output_tokens = metrics.outputTokenCount ?? 0;
    finalReformatted.stop_reason = metrics.stop_reason ?? null;
  }

  return JSON.stringify({
    ...finalReformatted,
  });
};
