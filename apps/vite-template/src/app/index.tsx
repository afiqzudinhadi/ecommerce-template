import "@repo/ui/styles/styles.css";
import "@repo/ui/styles/global.css";
import { CounterButton } from "@repo/ui/counter-button";
import { Link } from "@repo/ui/link";

import { Button } from "@repo/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
} from "@clerk/clerk-react";

function App() {
	return (
		<div>
			<header className="flex items-center justify-end py-4 px-6 bg-white shadow-sm mb-6">
				<div>
					<SignedOut>
						<SignInButton mode="modal">
							<Button variant="outline">Sign In</Button>
						</SignInButton>
					</SignedOut>
					<SignedIn>
						<UserButton />
					</SignedIn>
				</div>
			</header>

			<div className="container">
				<h1 className="title">
					Admin <br />
					<span>Kitchen Sink</span>
				</h1>
				<CounterButton />

				<Card className="my-6">
					<CardHeader>
						<CardTitle>shadcn/ui Card Example</CardTitle>
					</CardHeader>
					<CardContent>
						<Button>shadcn/ui Button</Button>
					</CardContent>
				</Card>

				<Card className="my-6">
					<CardHeader>
						<CardTitle>Clerk Authentication Example</CardTitle>
					</CardHeader>
					<CardContent>
						<SignedOut>You are signed out!</SignedOut>
						<SignedIn>You are signed in!</SignedIn>
					</CardContent>
				</Card>

				<p className="description">
					Built With{" "}
					<Link href="https://turborepo.com" newTab>
						Turborepo
					</Link>
					{" & "}
					<Link href="https://vitejs.dev/" newTab>
						Vite
					</Link>
				</p>
			</div>
		</div>
	);
}

export default App;
