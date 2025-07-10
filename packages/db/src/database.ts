import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

let db_url = process.env.DATABASE_URL!;
if (!db_url) {
	throw new Error("DATABASE_URL is not set in environment variables.");
}

try {
	db_url = decodeURI(db_url);
} catch {
	console.warn("Failed to decode DATABASE_URL, using as is.");
}

const maskedUrl = db_url.replace(
	/(postgresql:\/\/[^:]+:)[^@]+(@[^\/]+)/,
	'$1***$2'
);
console.log("Connecting to database URL:", maskedUrl);

const client = postgres(db_url!);

export const db = drizzle(client);
