"use server";

import DEFAULT_LOG_STRUCTURE from "@/constants/logStructure";
import { S3_Conn } from "@/helpers/aws";
import { getFormattedDateForLogs } from "@/helpers/dates";

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
        (field) => !args.hasOwnProperty(field),
      ).join(", ")}`,
    );
  }

  // these are the fields we're going to use to log the data
  const { conversation_id, user_input, model_response, ...rest } = args;

  // generate a unique id for the data
  const data_id = crypto.randomUUID();

  // create the log object
  const logData = {
    ...DEFAULT_LOG_STRUCTURE,
    ...rest,
    chat_transaction_id: data_id,
    timestamp: getFormattedDateForLogs(),
    conversation_id,
    user_input,
    model_response,
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

export async function log(data) {
  try {
    await logCommunication(data);
    return { message: "Success" };
  } catch (error) {
    console.error("Error:", error);
    throw new Error(`Internal Server Error: ${error.message}`);
  }
}
