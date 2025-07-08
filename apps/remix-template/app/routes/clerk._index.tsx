import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/remix";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";

export default function Index() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader>
					<CardTitle className="text-center">Welcome</CardTitle>
				</CardHeader>
				<CardContent>
					<SignedIn>
						<div className="flex flex-col items-center gap-4">
							<p className="text-green-700 font-medium">
								You are signed in!
							</p>
							<UserButton />
						</div>
					</SignedIn>
					<SignedOut>
						<div className="flex flex-col items-center gap-4">
							<p className="text-red-700 font-medium">
								You are signed out
							</p>
							<SignInButton mode="modal">
								<Button variant="default">Sign In</Button>
							</SignInButton>
						</div>
					</SignedOut>
				</CardContent>
			</Card>
		</div>
	);
}
