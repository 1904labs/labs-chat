import { cookies } from "next/headers";
import { runWithAmplifyServerContext } from "@helpers/amplify-server-utils";
import { getCurrentUser } from "aws-amplify/auth/server";
import { fetchUserAttributes } from "aws-amplify/auth/server";

export async function GET(): Promise<Response> {
  const attributes = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => fetchUserAttributes(contextSpec),
  });
  return Response.json(attributes);
}
