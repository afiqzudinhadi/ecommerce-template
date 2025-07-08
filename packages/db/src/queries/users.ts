import { db } from "../database";
import { InsertUser, users } from "../schema/users";
import { eq } from "drizzle-orm";

export async function createUser(data: InsertUser) {
	return await db.insert(users).values(data);
}

export async function getUsers() {
	return await db.select().from(users);
}
export async function getUserById(id: string) {
	const result = await db
		.select()
		.from(users)
		.where(eq(users.id, id))
		.limit(1);

	return result[0] || null;
}
