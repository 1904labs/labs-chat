import {
  Session,
  ConversationElement,
  ConversationContext,
  ConversationContentText,
  ConversationContentImage,
  ConversationSegment,
} from "./../app/types";

export class Memory {
  private session: Session;
  private verbose: boolean;
  private human_role: string;
  private ai_role: string;

  constructor(verbose = false) {
    // todo in the future this should contain sessions for multiple users
    // add this.sessions as a hashtable?
    // also the session shouldn't be created here. will let LC-44 change this?
    this.session = {
      session_id: "1234",
      user_id: "test_user",
      timestamp: Date.now(),
      conversation_s3_link: "",
      conversation_history: [],
      conversation_context: { token_size: 0, context: [] },
      system_prompt: process.env.SYSTEM_PROMPT as string,
      system_prompt_s3_ptr: "", // todo when config is pointing to this location
      session_name: "New Session",
      is_hidden: false,
      ai_stream: "",
    };
    this.verbose = verbose;
    this.human_role = "user";
    this.ai_role = "assistant";
  }

  addHumanMessage(message) {
    // todo: add a limit to the context size, plus auto reduce context size
    if (this.verbose) {
      console.log(`Adding human message: ${message}`);
    }
    // add to history
    this.session.conversation_history.push({
      role: this.human_role,
      content: [
        {
          type: "text",
          text: message,
        } as ConversationContentText,
      ],
      timestamp: Date.now().toString(),
      current_context: this.concatConversationText(
        this.session.conversation_context,
      ),
    } as ConversationElement);
    // add to context
    this.session.conversation_context.context.push({
      role: this.human_role,
      content: [
        {
          type: "text",
          text: message,
        } as ConversationContentText,
      ],
    });
  }

  commitAIStream() {
    // todo: add a limit to the context size, plus auto reduce context size
    if (this.verbose) {
      console.log(`Adding AI message: ${this.session.ai_stream}`);
    }
    // add history
    this.session.conversation_history.push({
      role: this.ai_role,
      content: [
        {
          type: "text",
          text: this.session.ai_stream,
        } as ConversationContentText,
      ],
      timestamp: Date.now().toString(),
      current_context: this.concatConversationText(
        this.session.conversation_context,
      ),
    } as ConversationElement);
    // add to context
    this.session.conversation_context.context.push({
      role: this.ai_role,
      content: [
        {
          type: "text",
          text: this.session.ai_stream,
        } as ConversationContentText,
      ],
    });
    // clear the stream upon committing
    this.clearAIStream();
  }

  accumulateAIStream(textDelta) {
    if (this.verbose) {
      console.log(`Accumulating AI stream: ${textDelta}`);
    }
    this.session.ai_stream += textDelta;
  }

  clearAIStream() {
    if (this.verbose) {
      console.log(`Clearing AI stream`);
    }
    this.session.ai_stream = "";
  }

  concatConversationText(context: ConversationContext): string {
    return context.context
      .map((segment) => {
        // Concatenate the content for each segment
        const contentText = segment.content
          .map((content) => {
            if ((content as ConversationContentImage).path) {
              // Content is an image
              const imageContent = content as ConversationContentImage;
              return `${imageContent.path} `;
            } else {
              // Content is text
              const textContent = content as ConversationContentText;
              return `${textContent.text}`;
            }
          })
          .join(" "); // Join all content within a segment with spaces

        return `${segment.role}: ${contentText}`;
      })
      .join("\n"); // Join all segments with new lines
  }
  getContext(): ConversationSegment[] {
    return this.session.conversation_context.context;
  }
  getSystemPrompt(): string {
    return this.session.system_prompt;
  }
}
