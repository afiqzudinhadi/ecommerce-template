import React, { useState, useCallback } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { getProducts } from "@repo/db/index";
import { ProductGrid } from "@repo/ui/components/products/index";
import { ProductCreate } from "@repo/ui/components/products/create";
import { PaginatedResponse } from "@repo/ui/components/template/table-show";
import { Button } from "@repo/ui/components/button";

interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	imageUrl?: string;
	isPublished?: boolean;
	created_at?: string;
	updated_at?: string;
}

interface LoaderData {
	products: PaginatedResponse<Product>;
	error: string | null;
}

export async function loader({
	request,
}: LoaderFunctionArgs): Promise<LoaderData> {
	try {
		const url = new URL(request.url);
		const page = parseInt(url.searchParams.get("page") || "1");
		const limit = parseInt(url.searchParams.get("limit") || "10");

		const result = await getProducts(page, limit);

		const products: PaginatedResponse<Product> = {
			data: result.data.map((product: any) => ({
				...product,
				id: String(product.id),
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

		// Return raw object with Single Fetch
		return { products, error: null };
	} catch (error: any) {
		console.error("Failed to fetch products:", error);

		// Return raw object with Single Fetch
		return {
			products: {
				data: [],
				pagination: {
					page: 1,
					limit: 10,
					totalCount: 0,
					totalPages: 0,
					hasNextPage: false,
					hasPreviousPage: false,
				},
			},
			error: error.message || "Failed to load products",
		};
	}
}

export default function ProductPage() {
	const { products, error } = useLoaderData<LoaderData>();
	const revalidator = useRevalidator();

	const [loading, setLoading] = useState(false);
	const [showCreateForm, setShowCreateForm] = useState(false);

	const handlePageChange = (page: number) => {
		// Use Remix navigation for better UX
		const url = new URL(window.location.href);
		url.searchParams.set("page", page.toString());
		window.history.pushState({}, "", url);
		revalidator.revalidate();
	};

	const handleEdit = (product: Product) => {
		// TODO: Implement edit functionality
		console.log("Edit product:", product);
	};

	const handleDelete = async (productId: string) => {
		if (!confirm("Are you sure you want to delete this product?")) {
			return;
		}

		try {
			const response = await fetch(`/api/products/${productId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.error || "Failed to delete product");
			}

			// Refresh products list
			revalidator.revalidate();
		} catch (err: any) {
			console.error("Delete error:", err);
			alert(`Failed to delete product: ${err.message}`);
		}
	};

	const handleProductCreated = useCallback(() => {
		// Refresh the entire page data using Remix revalidator
		revalidator.revalidate();
		setShowCreateForm(false);
	}, [revalidator]);

	const handleFormCancel = () => {
		setShowCreateForm(false);
	};

	// Show loading state when revalidating
	if (revalidator.state === "loading" && products.data.length === 0) {
		return (
			<div className="flex justify-center items-center min-h-64">
				<div className="text-lg text-gray-600">Loading products...</div>
			</div>
		);
	}

	// Show error state
	if (error && products.data.length === 0) {
		return (
			<div className="flex flex-col justify-center items-center min-h-64 space-y-4">
				<div className="text-red-600 bg-red-50 p-4 rounded-md max-w-md text-center">
					<h3 className="font-semibold mb-2">
						Error Loading Products
					</h3>
					<p>{error}</p>
				</div>
				<Button
					onClick={() => revalidator.revalidate()}
					variant="outline"
				>
					Try Again
				</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Header Section */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Products</h1>
					<p className="text-gray-600 mt-1">
						{products.pagination.totalCount} product
						{products.pagination.totalCount !== 1 ? "s" : ""} found
					</p>
				</div>
				<Button
					onClick={() => setShowCreateForm(!showCreateForm)}
					variant={showCreateForm ? "outline" : "default"}
				>
					{showCreateForm ? "Cancel" : "Add Product"}
				</Button>
			</div>

			{/* Create Product Form */}
			{showCreateForm && (
				<div className="mb-6 max-w-md">
					<ProductCreate
						onSuccess={handleProductCreated}
						onCancel={handleFormCancel}
						apiEndpoint="/api/products"
						className="bg-white border rounded-lg shadow-sm"
					/>
				</div>
			)}

			{/* Error Banner */}
			{error && products.data.length > 0 && (
				<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
					<p>
						<strong>Warning:</strong> {error}
					</p>
				</div>
			)}

			{/* Products Grid */}
			<ProductGrid
				paginatedProducts={products}
				onEdit={handleEdit}
				onDelete={handleDelete}
				onPageChange={handlePageChange}
				loading={revalidator.state === "loading"}
				className="mt-6"
			/>
		</div>
	);
}
