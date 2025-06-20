import { Button } from "@repo/ui/components/button.js";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card.js";

export default function HomePage() {
	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader>
					<CardTitle className="text-3xl font-bold text-center">
						Welcome to the Next.js Homepage
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col items-center gap-6">
					<p className="text-gray-600 text-center">
						This homepage uses{" "}
						<span className="font-semibold">shadcn/ui</span>{" "}
						components from{" "}
						<span className="font-mono">@repo/ui</span>.
					</p>
					<div className="flex gap-4">
						<Button asChild>
							<a
								href="https://nextjs.org/"
								target="_blank"
								rel="noopener noreferrer"
							>
								Learn Next.js
							</a>
						</Button>
						<Button variant="outline" asChild>
							<a
								href="https://ui.shadcn.com/"
								target="_blank"
								rel="noopener noreferrer"
							>
								Explore shadcn/ui
							</a>
						</Button>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}
