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

export default DEFAULT_LOG_STRUCTURE;
