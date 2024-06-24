import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "node:stream";
import { S3_client } from "@helpers/aws";

const s3PathRegex = /^s3:\/\/([^\/]+)\/(.+)$/;

interface S3PathComponents {
  Bucket: string;
  Key: string;
}

/**
 * Extracts the bucket name and key from an S3 bucket path.
 *
 * @param {string} s3Path - The S3 bucket path (e.g., "s3://my-bucket/path/to/my/file.txt").
 * @returns {S3PathComponents} - An object containing the bucket name and key.
 * @throws {Error} - If the S3 path is invalid.
 */
export function extractS3BucketAndKey(s3Path: string): S3PathComponents {
  const match = s3Path.match(s3PathRegex);
  if (!match) {
    throw new Error("Invalid S3 path");
  }
  return { Bucket: match[1], Key: match[2] };
}

/**
 * Fetches an object from an S3 bucket and JSON parses its content as T.
 *
 * @template T - The type to which the JSON content will be parsed.
 * @param {string} s3Path - The full path to a s3 object.
 * @returns {Promise<T>} - A promise that resolves to the parsed JSON content of the object.
 * @throws {Error} - If there is an error fetching the object or parsing the content.
 */
export async function getS3Object<T>(s3Path: string): Promise<T> {
  const pathComponents = extractS3BucketAndKey(s3Path);

  try {
    const command = new GetObjectCommand(pathComponents);
    const response = await S3_client.send(command);
    if (!response.Body) {
      throw new Error("No content found in the object");
    }

    const streamToString = (stream: Readable): Promise<string> => {
      return new Promise((resolve, reject) => {
        const chunks: any[] = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", (err) => reject(err));
        stream.on("end", () =>
          resolve(Buffer.concat(chunks).toString("utf-8")),
        );
      });
    };

    const bodyContent = await streamToString(response.Body as Readable);
    return JSON.parse(bodyContent) as T;
  } catch (error) {
    console.error("Error getting object:", error);
    throw new Error("Error getting object");
  }
}
