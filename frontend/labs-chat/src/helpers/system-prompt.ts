import { getS3Object } from "@helpers/s3";
import { S3SystemPrompt } from "@/app/types";

export let systemPrompt: string;
getSystemPrompt(process.env.SYSTEM_PROMPT_FILE as string).then(
  (prompt: string) => {
    systemPrompt = prompt;
  },
);

async function getSystemPrompt(fileName: string): Promise<string> {
  // Construct the file path using the bucket path and the system prompt file name from the env file
  const filePath = `s3://${process.env.S3_SYSTEM_PROMPT_BUCKET}/chat/${fileName}.json`;
  console.log("Getting system prompt from S3: " + filePath);
  try {
    const res = await getS3Object<S3SystemPrompt>(filePath);
    return res.prompt;
  } catch (err) {
    console.error(err);
    // If there is an error, return the app's default prompt.
    return process.env.DEFAULT_SYSTEM_PROMPT || "";
  }
}
