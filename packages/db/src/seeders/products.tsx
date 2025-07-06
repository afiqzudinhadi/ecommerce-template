import { faker } from "@faker-js/faker";
import { db } from "../database";
import { products } from "../schema/products";
import type { SeedFunction } from "./seed";

type ProductRow = {
	id: number;
	name: string;
	description: string | null;
	price: string;
	imageUrl: string | null;
	isPublished: boolean;
};

export const seedProducts: SeedFunction = async () => {
	// generate random data for 10 people to stick into the chefs table
	const data: ProductRow[] = Array.from({ length: 10 }, () => ({
		id: faker.number.int({ min: 1, max: 10000 }),
		name: faker.commerce.productName(),
		description: faker.commerce.productDescription(),
		price: faker.commerce.price({ min: 1, max: 1000, dec: 2 }),
		imageUrl: faker.image.url(),
		isPublished: faker.datatype.boolean(),
	}));

	await db.insert(products).values(data);

	return `${data.length} Products seeded successfully`;
};
