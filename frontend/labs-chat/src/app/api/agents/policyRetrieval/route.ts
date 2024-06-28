import { AgentConfiguration } from "@/app/types";

const POLICY_RETRIEVAL_AGENT: AgentConfiguration = {
  system_prompt_file: "",
  model: "anthropic.claude-3-sonnet-20240229-v1:0",
  additional_request_parameters: {
    anthropic_version: "bedrock-2023-05-31", // necessary for specifying the anthropic messaging api through bedrock
    max_tokens: 4096,
    temperature: 0.7,
  },
};

export default POLICY_RETRIEVAL_AGENT;
