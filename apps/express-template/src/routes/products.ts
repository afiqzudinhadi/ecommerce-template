import { Router } from "express";
import { createProduct, getProducts } from "@repo/db/index";

const router = Router();

// GET /api/products - Get all products
router.get("/", async (req, res) => {
	try {
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;

		// Validate pagination parameters
		if (page < 1 || limit < 1 || limit > 100) {
			return res.status(400).json({
				error: "Invalid pagination parameters. Page must be >= 1, limit must be 1-100",
			});
		}

		const result = await getProducts(page, limit);
		res.status(200).json(result);
	} catch (e: any) {
		console.log("Error fetching products:", e);
		res.status(500).json({ error: e.message });
	}
});

// POST /api/products - Create new product
router.post("/", async (req, res) => {
	try {
		const { name, price, description } = req.body;
		await createProduct({ name, price, description });
		res.status(201).json({ ok: true });
	} catch (e: any) {
		console.error("Error creating product:", e);
		res.status(500).json({ error: e.message });
	}
});

export default router;
