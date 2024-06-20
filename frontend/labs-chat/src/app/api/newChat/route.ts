import { newChat } from "@/app/api/streaming-llm/route";

export async function POST(req: Request) {
  try {
    const request = await req.json();
    await newChat("test_user");
    return Response.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `Internal Server Error: ${error.message}` },
      { status: 500 },
    );
  }
}
