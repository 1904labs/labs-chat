import {
  Session,
  ConversationElement,
  ConversationContext,
  ConversationContentText,
  ConversationContentImage,
  ConversationSegment,
  DynamoDBSession,
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
    this.newSession("test_user");
    this.verbose = verbose;
    this.human_role = "user";
    this.ai_role = "assistant";
  }

  /**
  * Adds a message to the history/context of the user's current session which is tagged as from the human/user
  * @param {string} message - The input message from the user
  * @returns {void}
  */
  addHumanMessage(message: string): void {
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
    // update timestamp
    this.session.timestamp = Date.now();
  }

  /**
  * Takes the user's current session and adds the `ai_stream`'s current text to both the conversation_history and conversation_context
  * @returns {void}
  */
  commitAIStream(): void {
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
    // update timestamp
    this.session.timestamp = Date.now();
    // clear the stream upon committing
    this.clearAIStream();
  }

  /**
  * Adds a string to the user's current session's `ai_stream`
  * This is used to accumulate the stream for the current transaction
  * @param {string} textDelta - The string taken from a streaming chunk, to be added to the ai's response
  * @returns {void}
  */
  accumulateAIStream(textDelta: string): void {
    if (this.verbose) {
      console.log(`Accumulating AI stream: ${textDelta}`);
    }
    this.session.ai_stream += textDelta;
  }

  /**
  * Clears the `ai_stream` for the user's current session
  * @returns {void}
  */
  clearAIStream(): void {
    if (this.verbose) {
      console.log(`Clearing AI stream`);
    }
    this.session.ai_stream = "";
  }

  /**
  * Joins a conversation context into a formatted string, mean to be saved in the conversation_history as the current context
  * @param {ConversationContext} context - The context to be joined
  * @returns {string} - The formatted string of the input context
  */
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

  /**
  * Creates a new session and replaces the current session
  * @param {string} user_id - The user_id for the current user
  * @returns {void}
  */
  newSession(user_id: string): void {
    this.session = {
      session_id: crypto.randomUUID(),
      user_id: user_id,
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
  }

  /**
  * Returns the conversation context for the user's current session
  * @returns {ConversationSegment[]} - The array of ConversationSegments which are passed to the Bedrock messaging api
  */
  getContext(): ConversationSegment[] {
    return this.session.conversation_context.context;
  }

  /**
  * Returns the system prompt for the user's current session
  * @returns {string} - The system prompt to be used for this session
  */
  getSystemPrompt(): string {
    return this.session.system_prompt;
  }

  getDynamoDBSession(): DynamoDBSession {
    return {
      session_id: this.session.session_id,
      user_id: this.session.user_id,
      timestamp: this.session.timestamp,
      conversation_s3_link: this.session.conversation_s3_link,
      system_prompt_s3_ptr: this.session.system_prompt_s3_ptr,
      session_name: this.session.session_name,
      is_hidden: this.session.is_hidden,
    };
  }
}
