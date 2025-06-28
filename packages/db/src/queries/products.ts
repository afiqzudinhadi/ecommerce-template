import { db } from "../database";
import { InsertProduct, product } from "../schema/products";

export async function createProduct(data: InsertProduct) {
	await db.insert(product).values(data);
}
