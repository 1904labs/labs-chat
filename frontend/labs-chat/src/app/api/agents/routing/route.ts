import { AgentConfiguration } from "@/app/types";

const ROUTING_AGENT: AgentConfiguration = {
  system_prompt_file: "",
  model: "anthropic.claude-3-haiku-20240307-v1:0",
  additional_request_parameters: {
    anthropic_version: "bedrock-2023-05-31", // necessary for specifying the anthropic messaging api through bedrock
    max_tokens: 50,
    temperature: 0.3,
  },
};

export default ROUTING_AGENT;
