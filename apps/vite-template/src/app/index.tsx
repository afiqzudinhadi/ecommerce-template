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

function App() {
	return (
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
	);
}

export default App;
