import { cookies } from "next/headers";
import { runWithAmplifyServerContext } from "@helpers/amplify-server-utils";
import { fetchUserAttributes } from "aws-amplify/auth/server";

export async function GET(): Promise<Response> {
  // This method will return the user attributes of the current user
  // { email: string, sub: string, name?: string }
  const attributes = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => fetchUserAttributes(contextSpec),
  });
  return Response.json(attributes);
}
