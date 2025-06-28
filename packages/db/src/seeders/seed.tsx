import { seedProducts } from "./products";
import { seedUsers } from "./users";

const seedDb = async () => {
	// note: this function assumes we're starting with an empty database

	console.log("Seeding database...");

	console.log("Adding independent data...");
	const res = await Promise.allSettled([
		seedUsers(),
		seedProducts(),
		// add more independent seeding functions here
		// these will run in parallel
	]);

	res.forEach((result) => {
		if (result.status === "rejected") {
			console.log("Error seeding database:", result.reason);
		} else {
			console.log(result.value);
		}
	});

	//   console.log("Adding related data...");
	//   const dependentTasks = [
	//     seedRecipes,
	//     // add more dependent tasks here, they will run in this order
	//   ];
	//   for (const task of dependentTasks) {
	//     try {
	//     const result = await task();
	//     console.log(result);
	//     } catch e {
	//       console.log("Error seeding database:", e);
	//     }
	//   }

	console.log("Seeding complete!");
};

seedDb()
	.then(() => {
		console.log("Seeding complete!");
		process.exit(0);
	})
	.catch((err) => {
		console.error("Error seeding database:", err);
		process.exit(1);
	});

export type SeedFunction = () => Promise<string>;
