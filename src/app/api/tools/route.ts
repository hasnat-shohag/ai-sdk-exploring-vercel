import { google } from "@ai-sdk/google";
import {
	streamText,
	UIMessage,
	convertToModelMessages,
	tool,
	stepCountIs,
	InferUITools,
	UIDataTypes,
} from "ai";
import { z } from "zod";

const tools = {
	getWeather: tool({
		description: "Get the weather for a location",
		inputSchema: z.object({
			city: z.string().describe("The city to get the weather for"),
		}),
		execute: async ({ city }) => {
			if (city === "dhaka") {
				return "26C and cloudy";
			} else if (city === "rajshahi") return "28C and clean";
			else return "Unknown";
		},
	}),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
	try {
		const { messages }: { messages: ChatMessage[] } = await req.json();

		const result = streamText({
			model: google("gemini-2.0-flash"),
			messages: convertToModelMessages(messages),
			tools,
			stopWhen: stepCountIs(2),
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error("Error creating chat:", error);
		return new Response("Failed to create chat", { status: 500 });
	}
}
