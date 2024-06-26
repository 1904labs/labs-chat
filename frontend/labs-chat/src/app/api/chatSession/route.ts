import { authenticatedUser } from "@helpers/amplify-server-utils";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { dynamoDBDocumentClient } from "@helpers/aws";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import {
  ConversationContext,
  ConversationElement,
  S3Conversation,
  Session,
} from "@/app/types";
import { getS3Object } from "@helpers/s3";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId") || "";
  if (!sessionId) {
    throw Error("No sessionId provided");
  }

  const user = await authenticatedUser({ cookies });
  const sessionsTable = process.env.DYNAMODB_TABLE_NAME || "";

  // look up s3 link
  const res = await dynamoDBDocumentClient.send(
    new QueryCommand({
      TableName: sessionsTable,
      KeyConditionExpression: "#uid = :user_id AND #sid = :session_id",
      ExpressionAttributeNames: {
        "#uid": "user_id",
        "#sid": "session_id",
        "#s3link": "conversation_s3_link",
        "#name": "session_name",
        "#prompt": "system_prompt_s3_ptr",
        "#hidden": "is_hidden",
        "#ts": "timestamp",
      },
      ExpressionAttributeValues: {
        ":user_id": user!.userId,
        ":session_id": sessionId,
      },
      ProjectionExpression: "#uid, #sid, #s3link, #name, #prompt, #hidden, #ts",
    }),
  );

  if (!res.Count) {
    throw new Error("No session found");
  }

  const session = res.Items![0] as Session;

  const chatHistory = await getS3Object<S3Conversation>(
    res.Items![0]["conversation_s3_link"],
  );

  session.conversation_history = chatHistory.conversationHistory;
  session.conversation_context = chatHistory.conversationContext;

  return Response.json(session);
}
