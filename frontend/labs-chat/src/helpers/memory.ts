import {
  Session,
  ConversationElement,
  ConversationContext,
  ConversationContentText,
  ConversationContentImage,
  ConversationSegment,
  DynamoDBSession,
} from "./../app/types";
import { S3_client } from "@helpers/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export class Memory {
  private session: Session;
  private verbose: boolean;
  private human_role: string;
  private ai_role: string;

  constructor(verbose = false, system_prompt = "", s3_ptr = "") {
    // todo in the future this should contain sessions for multiple users
    // add this.sessions as a hashtable?
    // also the session shouldn't be created here. will let LC-44 change this?
    // todo: remove the system prompt and s3_ptr from the Memory constructor - this will happen on session creation
    this.session = {
      session_id: "1234",
      user_id: "test_user",
      timestamp: Date.now(),
      conversation_s3_link: "",
      conversation_history: [],
      conversation_context: { token_size: 0, context: [] },
      system_prompt: system_prompt,
      system_prompt_s3_ptr: s3_ptr,
      session_name: "New Session",
      is_hidden: false,
      ai_stream: "",
    };
    this.verbose = verbose;
    this.human_role = "user";
    this.ai_role = "assistant";
  }

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
  }

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
    // clear the stream upon committing
    this.clearAIStream();
  }

  accumulateAIStream(textDelta: string): void {
    if (this.verbose) {
      console.log(`Accumulating AI stream: ${textDelta}`);
    }
    this.session.ai_stream += textDelta;
  }

  clearAIStream(): void {
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
  getHistory(): ConversationElement[] {
    return this.session.conversation_history;
  }
  getSessionId(): string {
    return this.session.session_id;
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
  async storeConversation() {
    const history = this.session.conversation_history;
    const context = this.session.conversation_context;
    const sessionId = this.session.session_id;
    const user_id = this.session.user_id;
    let bucketName;
    let convFileName;
    if (this.session.conversation_s3_link == "") {
      bucketName = process.env.S3_BUCKET;
      convFileName = `conversations/${user_id}/${sessionId}.json`;
      this.session.conversation_s3_link = `s3://${bucketName}/${convFileName}`;
    } else {
      const partialPath = this.session.conversation_s3_link.replace(
        "s3://",
        "",
      );
      const firstSlash = partialPath.indexOf("/");
      bucketName = partialPath.substring(0, firstSlash);
      convFileName = partialPath.substring(firstSlash + 1);
    }
    const params = {
      Bucket: bucketName,
      Key: convFileName,
      Body: JSON.stringify({
        conversationHistory: history,
        conversationContext: context,
      }),
      ContentType: "application/json",
    };
    const command = new PutObjectCommand(params);
    await S3_client.send(command);
  }
}
