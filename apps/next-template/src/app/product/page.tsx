import React from "react";
import { getProducts } from "@repo/db/index";
import PageClient from "./page-client";
import { Product } from "@repo/ui/components/products";
import { PaginatedResponse } from "@repo/ui/components/template/table-show";

export default async function ProductPage() {
	// Fetch initial data on the server (first page)
	let initialPaginatedProducts: PaginatedResponse<Product> = {
		data: [],
		pagination: {
			page: 1,
			limit: 10,
			totalCount: 0,
			totalPages: 0,
			hasNextPage: false,
			hasPreviousPage: false,
		},
	};
	let initialError = null;

	try {
		const result = await getProducts(1, 10); // Get first page with 10 items
		initialPaginatedProducts = {
			data: result.data.map((product: any) => ({
				...product,
				id: String(product.id), // Convert to string for consistency
				description: product.description ?? "",
				imageUrl: product.imageUrl ?? undefined,
				isPublished: product.isPublished ?? false,
				created_at: product.createdAt
					? product.createdAt.toISOString()
					: undefined,
				updated_at: product.updatedAt
					? product.updatedAt.toISOString()
					: undefined,
			})),
			pagination: result.pagination,
		};
	} catch (error: any) {
		console.error("Failed to fetch initial products:", error);
		initialError = error.message;
	}

	return (
		<div className="container">
			<PageClient
				initialPaginatedProducts={initialPaginatedProducts}
				initialError={initialError}
			/>
		</div>
	);
}
