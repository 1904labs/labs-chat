import { GetObjectCommand } from "@aws-sdk/client-s3";
import { S3_client as client } from "@helpers/aws";

// Construct file path using bucket path and the system prompt file name from the env file
const filePath =
  "system_prompts/chat/" + process.env.SYSTEM_PROMPT_FILE + ".json";

export async function getSystemPrompt(fileName: string): Promise<string> {
  // Construct the file path using the bucket path and the system prompt file name from the env file
  console.log("Getting system prompt from S3: " + filePath);
  // Construct the parameters for the S3 getObject command
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: filePath,
  };

  // Send the getObject command to the S3 client
  return new Promise(async (resolve) => {
    try {
      const data = await client.send(new GetObjectCommand(params));
      // Parse the response data to get the system prompt
      // The system prompt is stored in the "prompt" field of the JSON data
      // {
      //    "prompt": "You are a friendly, AI assistant, who answers my questions in a businesslike manner."
      //}
      const prompt = await new Response(data.Body)
        .json()
        .then((data) => data.prompt);
      resolve(prompt);
    } catch (err) {
      console.error(err);
      // If there is an error, return the app's default prompt.
      return process.env.DEFAULT_SYSTEM_PROMPT;
    }
  });
}
