import "@repo/ui/styles/styles.css";
import "@repo/ui/styles/global.css";
import {
	ClerkProvider,
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import { Button } from "@repo/ui/components/button";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body>
					<header className="flex items-center justify-end py-4 px-6 bg-white shadow-sm mb-6">
						<div>
							<SignedOut>
								<SignInButton mode="modal">
									<Button variant="outline">Sign In</Button>
								</SignInButton>
							</SignedOut>
							<SignedIn>
								<UserButton afterSignOutUrl="/" />
							</SignedIn>
						</div>
					</header>
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
