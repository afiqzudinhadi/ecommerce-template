import { pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "./column.helpers";

export const user = pgTable("users", {
	id: text("id").primaryKey(), // Clerk user ID
	email: text("email").notNull(),
	name: text("name"),
	role: text("role").default("user").notNull(),
	...timestamps,
});

export type InsertUser = typeof user.$inferInsert;
export type SelectUser = typeof user.$inferSelect;
