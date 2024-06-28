import { cookies } from "next/headers";
import { authenticatedUser } from "@helpers/amplify-server-utils";
import { getMemory } from "@helpers/memory";
import { getConfiguredSystemPrompt } from "@helpers/system-prompt";

export async function POST(req: Request) {
  // todo: consolidate where this code lives
  const user = await authenticatedUser({ cookies });
  try {
    const systemPrompt = await getConfiguredSystemPrompt();

    (await getMemory()).newSession(user!.userId, systemPrompt);
    return Response.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `Internal Server Error: ${error.message}` },
      { status: 500 },
    );
  }
}
