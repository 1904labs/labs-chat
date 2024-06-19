import { dynamoDBDocumentClient } from "@helpers/aws";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export async function GET(req: Request): Promise<Response> {
  const scanLimit = 20;
  const userId = "test_user"; // TODO: get from auth
  const sessionsTable = process.env.DYNAMODB_SESSIONS_TABLE || ""; // TODO: default value constant?

  console.log(`getting sessions from ${sessionsTable} for user ${userId}`);
  const res = await dynamoDBDocumentClient.send(new QueryCommand({
    TableName: sessionsTable,
    IndexName: "timestamp-index",
    KeyConditionExpression: "#uid = :user_id",
    FilterExpression: "#hidden = :hidden",
    ExpressionAttributeNames: {
      "#uid": "user_id",
      "#ts": "timestamp",
      "#hidden": "is_hidden"
    },
    ExpressionAttributeValues: {
      ":user_id": userId,
      ":hidden": false,
    },
    ScanIndexForward: false,
    Limit: scanLimit,
    ProjectionExpression: "#uid, session_id, session_name, #ts",
  }));

  // TODO: error handling?

  return Response.json(res.Items);
}
