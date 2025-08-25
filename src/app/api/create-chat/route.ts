import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI({
	apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
	// Create Google provider instance with API key

	const { prompt } = await req.json();

	const { text } = await generateText({
		model: google("gemini-2.0-flash"),
		prompt,
	});

	return Response.json({ text });
}
