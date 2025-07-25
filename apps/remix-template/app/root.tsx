import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";

import "@repo/ui/styles/styles.css";
import "@repo/ui/styles/global.css";

import type { LoaderFunction } from "@remix-run/node";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { ClerkApp } from "@clerk/remix";
export const loader: LoaderFunction = (args) => rootAuthLoader(args);

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
				<Analytics />
			</body>
		</html>
	);
}

export function App() {
	return <Outlet />;
}

export default ClerkApp(App);
