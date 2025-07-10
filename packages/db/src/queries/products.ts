import { db } from "../database.ts";
import { type InsertProduct, products } from "../schema/products.ts";
import { count, desc } from "drizzle-orm";

export async function createProduct(data: InsertProduct) {
	await db.insert(products).values(data);
}

export async function getProducts(page: number = 1, limit: number = 10) {
	const offset = (page - 1) * limit;

	const totalCountResult = await db.select({ count: count() }).from(products);
	const totalCount = totalCountResult[0].count;

	const productsList = await db
		.select()
		.from(products)
		.orderBy(desc(products.createdAt))
		.limit(limit)
		.offset(offset);

	return {
		data: productsList,
		pagination: {
			page,
			limit,
			totalCount,
			totalPages: Math.ceil(totalCount / limit),
			hasNextPage: page < Math.ceil(totalCount / limit),
			hasPreviousPage: page > 1,
		},
	};
}
