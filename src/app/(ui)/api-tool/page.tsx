"use client";
import { ChatMessage } from "@/app/api/api-tool/route";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Loader, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ToolInterface() {
	const [input, setInput] = useState("");
	const { messages, error, status, sendMessage, stop } = useChat<ChatMessage>({
		transport: new DefaultChatTransport({ api: "/api/api-tool" }),
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		sendMessage({ text: input });

		setInput("");
	};

	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div className='h-screen flex flex-col bg-gradient-to-br font-sans'>
			<div className='flex-1 overflow-y-auto scroll-smooth p-6'>
				<div className='mx-auto w-1/2'>
					{messages && (
						<>
							{messages.map((msg) => (
								<div
									key={msg.id}
									className={`my-3 flex ${
										msg.role === "assistant" ? "justify-start" : "justify-end"
									}`}
								>
									<div
										className={`max-w-[70%] p-3 rounded-2xl ${
											msg.role === "assistant"
												? ""
												: "bg-amber-50/10 text-right"
										}`}
									>
										<span className='block font-medium text-lg mb-1'>
											{msg.role === "assistant" ? "AI" : "User"}
										</span>
										{msg?.parts?.map((part, index) => {
											switch (part.type) {
												case "text":
													return (
														<div key={index} className='whitespace-pre-wrap'>
															{part.text}
														</div>
													);
												case "tool-getWeather":
													switch (part.state) {
														case "input-streaming":
															return (
																<div
																	key={index}
																	className='p-3 rounded-2xl text-sm text-yellow-300 flex items-center gap-2'
																>
																	<Loader className='w-4 h-4 animate-spin' />
																	<span>
																		<span className='font-semibold'>Tool:</span>{" "}
																		{part.type.replace("tool-", "")} → Receiving
																		input...
																	</span>
																</div>
															);

														case "input-available":
															return (
																<div
																	key={index}
																	className='p-3 rounded-2xl text-sm text-blue-300'
																>
																	<span className='font-semibold'>Tool:</span>{" "}
																	{part.type.replace("tool-", "")}
																	<br />
																	<span className='text-blue-200'>
																		Input: {JSON.stringify(part.input)}
																	</span>
																</div>
															);

														case "output-available":
															return (
																<div
																	key={index}
																	className='p-3 rounded-2xl text-sm text-green-300 border border-text-green-50 w-52'
																>
																	Weather
																	<br />
																	<br />
																	<div className='text-green-200'>
																		{part.output.location.name}
																	</div>
																	<div className='text-green-100'>
																		{part.output.current.temp_c}
																	</div>
																	<div className='text-green-100'>
																		{part.output.current.condition.text}
																	</div>
																</div>
															);

														case "output-error":
															return (
																<div
																	key={index}
																	className='p-3 rounded-2xl bg-red-500/10 border border-red-400/20 text-sm text-red-300 flex items-center gap-2'
																>
																	<Pause className='w-4 h-4' />
																	<span>
																		<span className='font-semibold'>
																			Error in tool:
																		</span>{" "}
																		{part.type.replace("tool-", "")}
																		<br />
																		<span>{part.errorText}</span>
																	</span>
																</div>
															);

														default:
															return null;
													}

												default:
													null;
											}
										})}
									</div>
								</div>
							))}
						</>
					)}
					{status === "submitted" && (
						<Loader className='animate-spin'>...</Loader>
					)}
					{error && <div className='text-red-500'>{error?.message}</div>}

					<div ref={bottomRef} />
				</div>
			</div>

			{/* Input Form */}
			<div className='mx-auto w-1/2 px-5'>
				<div className='bg-white/10 backdrop-blur-md px-5 py-3 lg:px-6 rounded-full'>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							setInput("");
							handleSubmit(e);
						}}
						className='flex gap-3 items-center'
					>
						<input
							type='text'
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder='Type your message...'
							className='flex-1 px-5 py-3.5 bg-transparent text-white placeholder-white/70 text-base outline-none transition-all duration-300 disabled:opacity-50'
						/>
						{status === "streaming" || status === "submitted" ? (
							<button
								type='submit'
								// disabled={isLoading || !input.trim()}
								className='px-6 py-3.5 rounded-full cursor-pointer font-semibold text-base transition-all duration-300 flex items-center gap-2'
								onClick={stop}
							>
								<Pause />
							</button>
						) : (
							<button
								type='submit'
								disabled={status !== "ready"}
								className='px-6 py-3.5 rounded-full cursor-pointer font-semibold text-base transition-all duration-300 flex items-center gap-2 disabled:bg-white/20 text-white/50 bg-gradient-to-br from-purple-400 to-purple-600 hover:shadow-lg hover:scale-105'
							>
								Send
							</button>
						)}
					</form>
				</div>
			</div>
		</div>
	);
}
