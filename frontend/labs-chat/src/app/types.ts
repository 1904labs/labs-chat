type Session = {
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
}

type ConversationSegment = {
    role: string;
    content: (ConversationContentText | ConversationContentImage)[];
}

interface ConversationElement extends ConversationSegment {
    timestamp: string;
    current_context: string;
}

type ConversationContext = {
    token_size: number;
    context: ConversationSegment[];
}

type ConversationContentText = {
    type: string;
    text: string;
}

type ConversationContentImage = {
    type: string;
    path: string;
}
