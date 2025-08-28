import { streamText } from "ai";
import { google } from "@/app/api/common";

export async function POST(req: Request) {
	try {
		const { prompt } = await req.json();
		const stream = streamText({
			model: google("gemini-2.0-flash"),
			prompt,
		});

		return stream.toUIMessageStreamResponse();
	} catch (error) {
		console.log("Error occurred while streaming text", error);
		return new Response("Failed to stream text", { status: 500 });
	}
}
