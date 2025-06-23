import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from "@repo/ui/components/card";

export default function ClerkTestPage() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-muted">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader>
					<CardTitle>Welcome, you are logged in!</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						This is a protected test page.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
