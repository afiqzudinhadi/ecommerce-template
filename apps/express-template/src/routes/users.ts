import { Router } from "express";
import { getUsers, createUser } from "@repo/db/index";
import { randomUUID } from "crypto";

const router = Router();

// GET /api/users - Get all users
router.get("/", async (req, res) => {
	try {
		const users = await getUsers();
		res.json(users);
	} catch (error: unknown) {
		console.error("Error fetching users:", error);
		res.status(500).json({
			error: "Failed to fetch users",
			message: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

// POST /api/users - Create new user
router.post("/", async (req, res) => {
	try {
		const { name, email, password, role } = req.body;

		// Validation
		if (!name || !email || !password) {
			return res.status(400).json({
				error: "Missing required fields: name, email, and password are required",
			});
		}

		// Email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}

		// Password length validation
		if (password.length < 6) {
			return res
				.status(400)
				.json({ error: "Password must be at least 6 characters long" });
		}

		// Role validation (based on schema enum)
		const validRoles = ["admin", "user"];
		if (role && !validRoles.includes(role)) {
			return res.status(400).json({
				error: "Invalid role. Must be 'admin' or 'user'",
			});
		}
		const userData = {
			id: randomUUID(),
			name: name.trim(),
			email: email.toLowerCase().trim(),
			role: role || "user", // Default role
		};

		const newUser = await createUser(userData);

		res.status(201).json(newUser);
	} catch (error: unknown) {
		console.error("Error creating user:", error);

		// Handle unique constraint violation (duplicate email)
		if (
			error instanceof Error &&
			(error.message?.includes("duplicate") ||
				(error as any).code === "23505")
		) {
			return res.status(409).json({ error: "Email already exists" });
		}

		res.status(500).json({
			error: "Failed to create user",
			message: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

export default router;
