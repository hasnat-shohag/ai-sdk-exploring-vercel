"use client";
import { recipeSchema } from "@/app/api/structured-data/schema";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Pause } from "lucide-react";
import { useState } from "react";

export default function ChatInterface() {
	const [dish, setDish] = useState("");
	const { object, submit, isLoading, error, stop } = useObject({
		api: "/api/structured-data",
		schema: recipeSchema,
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		submit({
			recipe: dish,
		});
		setDish("");
	};

	return (
		<div className='h-screen flex flex-col bg-gradient-to-br font-sans'>
			<div className='flex-1 overflow-y-auto p-6'>
				{isLoading && <div className='mx-20'>Loading...</div>}
				{error && <div className='text-red-500 mx-20'>{error?.message}</div>}
				{object && object.recipe && (
					<div className='mx-20'>
						<div className='bg-white/10 rounded-xl shadow-lg p-8 mb-8 border border-white/20 backdrop-blur-md'>
							<h2 className='text-3xl font-bold text-purple-600 mb-4'>
								{object.recipe.name}
							</h2>
							<div className='mb-6'>
								<h3 className='text-xl font-semibold text-purple-400 mb-2'>
									Ingredients
								</h3>
								<ul className='list-disc list-inside space-y-2'>
									{Array.isArray(object.recipe.ingredients) &&
										object.recipe.ingredients.map((ingredient, idx) =>
											ingredient &&
											typeof ingredient.name === "string" &&
											typeof ingredient.amount === "string" ? (
												<li key={idx} className='text-base text-white/90'>
													<span className='font-medium text-purple-300'>
														{ingredient.name}
													</span>
													: {ingredient.amount}
												</li>
											) : null
										)}
								</ul>
							</div>
							<div>
								<h3 className='text-xl font-semibold text-purple-400 mb-2'>
									Steps
								</h3>
								<ol className='list-decimal list-inside space-y-2'>
									{Array.isArray(object.recipe.steps) &&
										object.recipe.steps.map((step, idx) =>
											typeof step === "string" ? (
												<li key={idx} className='text-base text-white/90'>
													{step}
												</li>
											) : null
										)}
								</ol>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Input Form */}
			<div className='bg-white/10 backdrop-blur-md p-5 lg:px-6 border-t border-white/20'>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						setDish("");
						handleSubmit(e);
					}}
					className='flex gap-3 items-center mx-20'
				>
					<input
						type='text'
						value={dish}
						onChange={(e) => setDish(e.target.value)}
						placeholder='Enter a dish name...'
						className='flex-1 px-5 py-3.5 bg-white/10 border-2 border-white/20 rounded-full text-white placeholder-white/70 text-base outline-none transition-all duration-300 backdrop-blur-md focus:border-white/40 focus:bg-white/15 disabled:opacity-50'
					/>
					{isLoading ? (
						<button
							type='submit'
							className='px-6 py-3.5 rounded-full cursor-pointer font-semibold text-base transition-all duration-300 flex items-center gap-2'
							onClick={stop}
						>
							<Pause />
						</button>
					) : (
						<button
							type='submit'
							disabled={isLoading || !dish.trim()}
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
