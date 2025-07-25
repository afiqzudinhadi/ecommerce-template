import { pgTable, serial, text, numeric, boolean } from "drizzle-orm/pg-core";
import { timestamps } from "./column.helpers.ts";

export const products = pgTable("products", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	price: numeric("price", { precision: 10, scale: 2 }).notNull(),
	imageUrl: text("image_url"),
	isPublished: boolean("is_published").default(false),
	...timestamps,
});

export type InsertProduct = typeof products.$inferInsert;
export type SelectProduct = typeof products.$inferSelect;
