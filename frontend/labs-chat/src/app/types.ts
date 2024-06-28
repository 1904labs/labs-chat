export type AgentConfiguration = {
  system_prompt_file: string;
  model: string;
  additional_request_parameters?: {
    [key: string]: string | number;
  };
};

export type Session = {
  session_id: string;
  user_id: string;
  timestamp: number;
  conversation_s3_link: string;
  conversation_history: ConversationElement[];
  conversation_context: ConversationContext;
  system_prompt: string;
  system_prompt_s3_ptr: string;
  session_name: string;
  is_hidden: boolean;
  ai_stream: string;
};

export type DynamoDBSession = {
  session_id: string;
  user_id: string;
  timestamp: number;
  conversation_s3_link: string;
  system_prompt_s3_ptr: string;
  session_name: string;
  is_hidden: boolean;
};

export type ConversationSegment = {
  role: string;
  content: (ConversationContentText | ConversationContentImage)[];
};

export interface ConversationElement extends ConversationSegment {
  timestamp: string;
  current_context: string;
}

export type ConversationContext = {
  token_size: number;
  context: ConversationSegment[];
};

export type ConversationContentText = {
  type: string;
  text: string;
};

export type ConversationContentImage = {
  type: string;
  path: string;
};

export type User = {
  userAttributes:
    | {
        email: string;
        sub: string;
        name: string;
      }
    | null
    | {};
};
