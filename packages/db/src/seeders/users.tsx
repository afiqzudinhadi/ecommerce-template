import { faker } from "@faker-js/faker";
import { db } from "../database";
import { user } from "../schema/users";
import type { SeedFunction } from "./seed";

type UserRow = {
	id: string;
	name: string;
	email: string;
};

export const seedUsers: SeedFunction = async () => {
	// generate random data for 10 people to stick into the chefs table
	const data: UserRow[] = Array.from({ length: 10 }, () => ({
		id: faker.number.int({ min: 1, max: 10000 }).toString(),
		name: faker.person.fullName(),
		email: faker.internet.email(),
	}));

	await db.insert(user).values(data);

	return `${data.length} Users seeded successfully`;
};
