import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

let db_url = process.env.DATABASE_URL!;
try {
	db_url = decodeURI(db_url);
} catch (e) {
	console.warn("Failed to decode DATABASE_URL, using as is.");
}

console.log("Connecting to database URL:", db_url);

const client = postgres(db_url!);

export const db = drizzle(client);
