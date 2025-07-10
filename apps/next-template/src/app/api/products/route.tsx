import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@repo/db/index";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");

		// Validate pagination parameters
		if (page < 1 || limit < 1 || limit > 100) {
			return NextResponse.json(
				{
					error: "Invalid pagination parameters. Page must be >= 1, limit must be 1-100",
				},
				{ status: 400 }
			);
		}

		const result = await getProducts(page, limit);
		return NextResponse.json(result);
	} catch (error: any) {
		console.error("API Error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch products", message: error.message },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, description, price, imageUrl, isPublished } = body;

		// Enhanced validation
		if (!name || typeof name !== "string" || !name.trim()) {
			return NextResponse.json(
				{
					error: "Product name is required and must be a non-empty string",
				},
				{ status: 400 }
			);
		}

		if (price === undefined || price === null || isNaN(Number(price))) {
			return NextResponse.json(
				{ error: "Price is required and must be a valid number" },
				{ status: 400 }
			);
		}

		const priceValue = Number(price);
		if (priceValue < 0) {
			return NextResponse.json(
				{ error: "Price must be non-negative" },
				{ status: 400 }
			);
		}

		// Validate optional fields
		if (description && typeof description !== "string") {
			return NextResponse.json(
				{ error: "Description must be a string" },
				{ status: 400 }
			);
		}

		if (imageUrl && typeof imageUrl !== "string") {
			return NextResponse.json(
				{ error: "Image URL must be a string" },
				{ status: 400 }
			);
		}

		// Validate URL format if provided
		if (imageUrl && imageUrl.trim()) {
			try {
				new URL(imageUrl.trim());
			} catch {
				return NextResponse.json(
					{ error: "Image URL must be a valid URL" },
					{ status: 400 }
				);
			}
		}

		// Prepare product data
		const productData = {
			name: name.trim(),
			description: description?.trim() || null,
			price: priceValue,
			imageUrl: imageUrl?.trim() || null,
			isPublished: Boolean(isPublished),
		};

		// Create product in database
		const newProduct = await createProduct(productData);

		// Return success response with created product
		return NextResponse.json(
			{
				success: true,
				message: "Product created successfully",
				data: newProduct,
			},
			{ status: 201 }
		);
	} catch (error: any) {
		console.error("API Error:", error);

		// Handle specific database errors
		if (error.message?.includes("duplicate") || error.code === "23505") {
			return NextResponse.json(
				{
					success: false,
					error: "Product already exists",
					message: "A product with this name already exists",
				},
				{ status: 409 }
			);
		}

		// Handle database connection errors
		if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
			return NextResponse.json(
				{
					success: false,
					error: "Database connection failed",
					message: "Unable to connect to database",
				},
				{ status: 503 }
			);
		}

		// Handle validation errors from database
		if (error.code === "23502") {
			// NOT NULL violation
			return NextResponse.json(
				{
					success: false,
					error: "Missing required field",
					message: "A required field is missing",
				},
				{ status: 400 }
			);
		}

		// Generic error response
		return NextResponse.json(
			{
				success: false,
				error: "Failed to create product",
				message: error.message || "An unexpected error occurred",
				...(process.env.NODE_ENV === "development" && {
					stack: error.stack,
				}),
			},
			{ status: 500 }
		);
	}
}
