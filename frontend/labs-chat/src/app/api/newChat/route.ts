import { cookies } from "next/headers";
import { getCurrentUser } from "aws-amplify/auth/server";
import { newChat } from "@/app/api/streaming-llm/route";
import { authenticatedUser } from "@helpers/amplify-server-utils";

export async function POST(req: Request) {
  // todo: consolidate where this code lives
  const user = await authenticatedUser({ cookies });
  try {
    const request = await req.json();
    await newChat(user.userId);
    return Response.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `Internal Server Error: ${error.message}` },
      { status: 500 },
    );
  }
}
