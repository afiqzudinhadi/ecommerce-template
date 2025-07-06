import { db } from "../database";
import { InsertProduct, products } from "../schema/products";

export async function createProduct(data: InsertProduct) {
	await db.insert(products).values(data);
}

export async function getProducts() {
	return db.select().from(products);
}
