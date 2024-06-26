import { dynamoDBDocumentClient } from "@helpers/aws";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { cookies } from "next/headers";
import { runWithAmplifyServerContext } from "@helpers/amplify-server-utils";
import { getCurrentUser } from "aws-amplify/auth/server";

export async function GET(): Promise<Response> {
  const scanLimit = 20;
  const sessionsTable = process.env.DYNAMODB_TABLE_NAME || ""; // TODO: default value constant?

  const user = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => getCurrentUser(contextSpec),
  });

  console.log(`getting sessions from ${sessionsTable} for user ${user.userId}`);
  const res = await dynamoDBDocumentClient.send(
    new QueryCommand({
      TableName: sessionsTable,
      IndexName: "timestamp-index",
      KeyConditionExpression: "#uid = :user_id",
      FilterExpression: "#hidden = :hidden",
      ExpressionAttributeNames: {
        "#uid": "user_id",
        "#ts": "timestamp",
        "#hidden": "is_hidden",
      },
      ExpressionAttributeValues: {
        ":user_id": user.userId,
        ":hidden": false,
      },
      ScanIndexForward: false,
      Limit: scanLimit,
      ProjectionExpression: "#uid, session_id, session_name, #ts",
    }),
  );

  // TODO: error handling?

  return Response.json(res.Items);
}
