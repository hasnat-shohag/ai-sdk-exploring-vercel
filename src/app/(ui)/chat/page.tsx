"use client";
import { useChat } from "@ai-sdk/react";
import { Loader, Pause } from "lucide-react";
import { useState } from "react";

export default function ChatInterface() {
	const [input, setInput] = useState("");
	const { messages, error, status, sendMessage } = useChat();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		sendMessage({ text: input });
		setInput("");
	};

	return (
		<div className='h-screen flex flex-col bg-gradient-to-br font-sans'>
			<div className='flex-1 overflow-y-auto p-6 mx-20'>
				{error && <div className='text-red-500'>{error?.message}</div>}

				{messages && (
					<div>
						{messages.map((msg) => (
							<div key={msg.id} className='my-2'>
								<span className='block font-medium text-lg'>
									{msg.role === "assistant" ? "AI" : "User"}
								</span>
								{msg?.parts?.map((part, index) => {
									if (part?.type == "text") {
										return <pre key={index}>{part?.text}</pre>;
									}
									return null;
								})}
							</div>
						))}
					</div>
				)}
				{status === "submitted" && (
					<Loader className='animate-spin'>...</Loader>
				)}
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
						disabled={status === "streaming" || status === "submitted"}
					/>
					<button
						type='submit'
						// disabled={isLoading || !input.trim()}
						className={`px-6 py-3.5 rounded-full cursor-pointer font-semibold text-base transition-all duration-300 flex items-center gap-2 ${
							!input.trim()
								? "bg-white/20 text-white/50"
								: "bg-gradient-to-br from-purple-400 to-purple-600 text-white hover:shadow-lg hover:scale-105 cursor-pointer"
						}`}
					>
						{status === "streaming" || status === "submitted" ? (
							<>
								<span className='animate-pulse' onClick={stop}>
									<Pause />
								</span>
							</>
						) : (
							<>
								<span>Send</span>
							</>
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
