import { db } from "../database";
import { InsertUser, user } from "../schema/users";

export async function createUser(data: InsertUser) {
	await db.insert(user).values(data);
}
