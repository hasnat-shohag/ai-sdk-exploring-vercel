"use client";
import { useChat } from "@ai-sdk/react";
import { Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ChatInterface() {
	const [input, setInput] = useState("");
	const { messages, error, status, sendMessage, stop } = useChat();

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
			<div className='flex-1 overflow-y-auto p-6'>
				{status === "submitted" ||
					(status === "streaming" && <div>Loading...</div>)}

				{error && <div className='text-red-500 mx-20'>{error?.message}</div>}
				{messages && (
					<div className='mx-20'>
						{messages.map((msg) => (
							<div key={msg.id} className='my-2'>
								<div className='text-sm'>
									{msg.role === "assistant" ? "AI" : "User"}
								</div>

								{msg.parts?.map((part, index) =>
									part.type === "text" ? (
										<span key={index}>{part.text}</span>
									) : null
								)}
							</div>
						))}
					</div>
				)}
				<div ref={bottomRef} />
			</div>

			{/* Input Form */}
			<div className='bg-white/10 backdrop-blur-md p-5 lg:px-6 border-t border-white/20'>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						setInput("");
						handleSubmit(e);
					}}
					className='flex gap-3 items-center mx-20'
				>
					<input
						type='text'
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder='Type your message...'
						className='flex-1 px-5 py-3.5 bg-white/10 border-2 border-white/20 rounded-full text-white placeholder-white/70 text-base outline-none transition-all duration-300 backdrop-blur-md focus:border-white/40 focus:bg-white/15 disabled:opacity-50'
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
	);
}
