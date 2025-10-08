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
			const res = await fetch(
				`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`
			);
			const data = await res.json();
			const weather = {
				location: {
					name: data?.location?.name,
					country: data?.location?.country,
					localtime: data?.location?.localtime,
				},
				current: {
					temp_c: data?.current?.temp_c,
					temp_f: data?.current?.temp_f,
					condition: {
						text: data?.current?.condition?.text,
					},
				},
			};
			return weather;
		},
	}),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
	try {
		const { messages }: { messages: UIMessage[] } = await req.json();

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
