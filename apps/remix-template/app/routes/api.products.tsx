import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { getProducts, createProduct } from "@repo/db/index";

export async function loader({ request }: LoaderFunctionArgs) {
	try {
		const url = new URL(request.url);
		const page = parseInt(url.searchParams.get("page") || "1");
		const limit = parseInt(url.searchParams.get("limit") || "10");

		if (page < 1 || limit < 1 || limit > 100) {
			return new Response(
				JSON.stringify({
					error: "Invalid pagination parameters. Page must be >= 1, limit must be 1-100",
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		const result = await getProducts(page, limit);
		return new Response(JSON.stringify(result), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (error: any) {
		console.error("API Error:", error);
		return new Response(
			JSON.stringify({
				error: "Failed to fetch products",
				message: error.message,
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}

export async function action({ request }: ActionFunctionArgs) {
	if (request.method !== "POST") {
		return new Response(JSON.stringify({ error: "Method not allowed" }), {
			status: 405,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const body = await request.json();
		const { name, description, price, imageUrl, isPublished } = body;

		// Validation
		if (!name || typeof name !== "string" || !name.trim()) {
			return new Response(
				JSON.stringify({
					error: "Product name is required and must be a non-empty string",
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		if (price === undefined || price === null || isNaN(Number(price))) {
			return new Response(
				JSON.stringify({
					error: "Price is required and must be a valid number",
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		const priceValue = Number(price);
		if (priceValue < 0) {
			return new Response(
				JSON.stringify({ error: "Price must be non-negative" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		const productData = {
			name: name.trim(),
			description: description?.trim() || null,
			price: priceValue.toString(),
			imageUrl: imageUrl?.trim() || null,
			isPublished: Boolean(isPublished),
		};

		const newProduct = await createProduct(productData);

		return new Response(
			JSON.stringify({
				success: true,
				message: "Product created successfully",
				data: newProduct,
			}),
			{
				status: 201,
				headers: { "Content-Type": "application/json" },
			}
		);
	} catch (error: any) {
		console.error("API Error:", error);
		return new Response(
			JSON.stringify({
				success: false,
				error: "Failed to create product",
				message: error.message || "An unexpected error occurred",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
