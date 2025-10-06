import { streamObject } from "ai";
import { recipeSchema } from "./schema";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
	const { recipe } = await req.json();

	const result = streamObject({
		model: google("gemini-1.5-flash"),
		schema: recipeSchema,
		prompt: `generate a recipe for ${recipe}`,
	});

	return result.toTextStreamResponse();
}
