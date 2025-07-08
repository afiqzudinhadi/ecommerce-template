import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error(
		"VITE_PUBLISHABLE_KEY is not defined. Please set it in your environment variables."
	);
}

const el = document.getElementById("root");
if (el) {
	const root = createRoot(el);
	root.render(
		<React.StrictMode>
			<ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
				<App />
			</ClerkProvider>
		</React.StrictMode>
	);
} else {
	throw new Error("Could not find root element");
}
