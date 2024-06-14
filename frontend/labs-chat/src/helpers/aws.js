import { S3Client } from "@aws-sdk/client-s3";

// Create an S3 client service object
// Only do this once and reuse the S3 client across the app
export const S3_client = new S3Client({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: "us-east-1",
});
