import { dynamoDBDocumentClient } from "@helpers/aws";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";


export async function GET(req: Request): Promise<Response> {
  const userId = "test_user"; // TODO: get from auth
  const sessionsTable = process.env.DYNAMODB_SESSIONS_TABLE || ""; // TODO: default value constant?

  console.log(`getting sessions from ${sessionsTable} for user ${userId}`);
  const res = await dynamoDBDocumentClient.send(new QueryCommand({
    TableName: sessionsTable,
    IndexName: "timestamp-index",
    KeyConditionExpression: "user_id = :user_id",
    ProjectionExpression: "user_id, session_name, is_hidden, #ts, conversation_s3_link",
    ExpressionAttributeValues: {
      ":user_id": userId,
    },
    ExpressionAttributeNames: {
      "#ts": "timestamp",
    },
  }));

  console.log(res)
  return Response.json(res.Items);
}

