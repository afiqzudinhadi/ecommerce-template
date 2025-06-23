import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/remix";
import { Button } from "@repo/ui/components/button";
import { Outlet } from "@remix-run/react";

export default function Index() {
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

			<Outlet />
		</div>
	);
}
