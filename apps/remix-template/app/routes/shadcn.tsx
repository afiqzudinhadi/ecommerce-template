import { Button } from "@repo/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { Link } from "@repo/ui/link";

export default function Index() {
	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader>
					<CardTitle className="text-3xl font-bold text-center">
						Welcome to the Remix Homepage
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
							<Link href="https://remix.run/">Learn Remix</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="https://ui.shadcn.com/">
								Explore shadcn/ui
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}
