import "./styles.css";
// import "@repo/ui/globals.css";
import "@repo/ui/globals.css";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
