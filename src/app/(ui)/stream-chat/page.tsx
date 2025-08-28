"use client";
import { useCompletion } from "@ai-sdk/react";
import { Pause } from "lucide-react";

export default function ChatInterface() {
	const {
		input,
		handleInputChange,
		handleSubmit,
		isLoading,
		setInput,
		completion,
		error,
		stop,
	} = useCompletion({
		api: "/api/stream",
	});

	return (
		<div className='h-screen flex flex-col bg-gradient-to-br font-sans'>
			<div className='flex-1 overflow-y-auto p-6 mx-20'>
				{error && <div className='text-red-500'>{error?.message}</div>}
				{isLoading && !completion && <div>Loading...</div>}
				{completion && <div>{completion}</div>}
			</div>

			{/* Input Form */}
			<div className='bg-white/10 backdrop-blur-md p-5 lg:px-6 border-t border-white/20'>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						setInput("");
						handleSubmit();
					}}
					className='flex gap-3 items-center mx-20'
				>
					<input
						type='text'
						value={input}
						onChange={handleInputChange}
						placeholder='Type your message...'
						className='flex-1 px-5 py-3.5 bg-white/10 border-2 border-white/20 rounded-full text-white placeholder-white/70 text-base outline-none transition-all duration-300 backdrop-blur-md focus:border-white/40 focus:bg-white/15 disabled:opacity-50'
						disabled={isLoading}
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
						{isLoading ? (
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
