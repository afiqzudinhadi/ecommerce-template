import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/schema",
	out: "./supabase/migrations",
	dialect: "postgresql",
	entities: {
		roles: {
			provider: "supabase",
		},
	},
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
