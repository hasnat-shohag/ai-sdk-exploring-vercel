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
	getLocation: tool({
		description:
			"Get the city location for a user by name. Use this BEFORE getWeather if the query mentions a person (e.g., 'mun' or 'hasnat').",
		inputSchema: z.object({
			name: z.string().describe("the name of the user"),
		}),
		execute: async ({ name }) => {
			if (name === "mun") {
				return "rajshahi";
			} else if (name === "hasnat") {
				return "dhaka";
			} else return "Unknown";
		},
	}),

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
			stopWhen: stepCountIs(5),
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error("Error creating chat:", error);
		return new Response("Failed to create chat", { status: 500 });
	}
}
