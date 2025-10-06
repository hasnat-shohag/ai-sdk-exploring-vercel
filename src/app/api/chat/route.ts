import { google } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages } from "ai";

export async function POST(req: Request) {
	try {
		const { messages }: { messages: UIMessage[] } = await req.json();

		const result = streamText({
			model: google("gemini-2.0-flash"),
			messages: convertToModelMessages(messages),
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error("Error creating chat:", error);
		return new Response("Failed to create chat", { status: 500 });
	}
}
