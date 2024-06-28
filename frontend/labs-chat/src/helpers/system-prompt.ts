"use server";
import { getS3Object } from "@helpers/s3";
import { S3SystemPrompt } from "@/app/types";

let systemPrompt: string;

export async function getConfiguredSystemPrompt(): Promise<string> {
  if (systemPrompt) {
    return systemPrompt;
  }
  systemPrompt = await getSystemPromptUsingFileName(
    process.env.SYSTEM_PROMPT_FILE!,
  );
  return systemPrompt;
}

export async function getSystemPromptUsingFileName(
  fileName: string,
): Promise<string> {
  // Construct the file path using the bucket path and the system prompt file name from the env file.
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
