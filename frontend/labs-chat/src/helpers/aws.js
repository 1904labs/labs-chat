import AWS from "aws-sdk";
import { S3Client } from "@aws-sdk/client-s3";

/**
 * Import the required fields for the communication data
 * only do this once at the top of the file
 */
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: "us-east-1",
});

// export the s3 option
export const S3_Conn = new AWS.S3();


export const S3_client = new S3Client({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: "us-east-1",
});