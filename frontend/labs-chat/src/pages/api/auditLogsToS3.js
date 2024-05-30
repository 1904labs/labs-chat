import { NextResponse } from "next/server";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

/**
 * Import the required fields for the communication data
 * only do this once at the top of the file
 * may be worth moving this to a separate file
 * and importing it where needed
 */
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: "us-east-1",
});
const S3_Conn = new AWS.S3();

// Default log structure for audit logs.
const DEFAULT_LOG_STRUCTURE = {
  timestamp: null,
  chat_transaction_id: null,
  model_id: process.env.MODEL,
  input_tokens: 0,
  output_tokens: 0,
  temperature: process.env.MODEL_TEMPERATURE,
  system_prompt: process.env.SYSTEM_PROMPT,
  stop_reason: null,
  error_text: null,
  conversation_id: null,
  user_input: null,
  model_response: null,
};

// Define the required fields for the communication data
const REQUIRED_FIELDS = ["conversation_id", "user_input", "model_response"];

/**
 * Logs communication data to S3 bucket.
 *
 * @param {string} conversation_id - The conversation ID.
 * @param {string} user_input - The user input.
 * @param {string} model_response - The model response.
 * @param {Object} rest - Additional properties to be logged.
 * @returns {Promise<void>} - A promise that resolves when the logging is complete.
 * @throws {Error} - If any of the required fields are missing.
 */
const logCommunication = async (args) => {

  // Quick check if any of the required fields are missing
  if (!REQUIRED_FIELDS.every((field) => args.hasOwnProperty(field))) {
    throw new Error(
      `Missing required fields: ${REQUIRED_FIELDS.filter(
        (field) => !args.hasOwnProperty(field)
      ).join(", ")}`
    );
  }

  // these are the fields we're going to use to log the data
  const { conversation_id, user_input, model_response, ...rest } = args;
  
  // generate a unique id for the data
  const data_id = uuidv4();

  // create the log object
  const logData = {
    ...DEFAULT_LOG_STRUCTURE,
    chat_transaction_id: data_id,
    timestamp: new Date().toISOString(),
    conversation_id,
    user_input,
    model_response,
    ...rest,
  };

  const logFileName = `logs/${data_id}.json`;
  const params = {
    Bucket: "labs-chat-data-bucket",
    Key: logFileName,
    Body: JSON.stringify(logData),
    ContentType: "application/json",
  };

  await S3_Conn.putObject(params).promise();
};

/**
 * Handles the HTTP POST request to log communication data.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Only POST is allowed" });
  }

  try {
    const requestBody = req.body;

    await logCommunication(requestBody);
    return res.status(200).json({ status: "Success" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
}
