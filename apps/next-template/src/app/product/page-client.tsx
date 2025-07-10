"use client";
import React, { useState, useCallback } from "react";
import { ProductGrid } from "@repo/ui/components/products/index";
import { PaginatedResponse } from "@repo/ui/components/template/table-show";
import { Button } from "@repo/ui/components/button";
import CreateForm from "./create-form";

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

interface PageClientProps {
	initialPaginatedProducts: PaginatedResponse<Product>;
	initialError: string | null;
}

const fetchProducts = async (
	page: number = 1,
	limit: number = 10
): Promise<PaginatedResponse<Product>> => {
	const response = await fetch(`/api/products?page=${page}&limit=${limit}`);
	if (!response.ok) {
		throw new Error("Failed to fetch products");
	}
	return response.json();
};

const PageClient: React.FC<PageClientProps> = ({
	initialPaginatedProducts,
	initialError,
}) => {
	const [paginatedProducts, setPaginatedProducts] = useState<
		PaginatedResponse<Product>
	>(initialPaginatedProducts);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(initialError);

	const loadProducts = useCallback(async (page: number = 1) => {
		try {
			setLoading(true);
			setError(null);
			const result = await fetchProducts(page);
			setPaginatedProducts(result);
		} catch (err: any) {
			console.error("Failed to load products:", err);
			setError(err.message || "Failed to load products");
		} finally {
			setLoading(false);
		}
	}, []);

	const handlePageChange = (page: number) => {
		loadProducts(page);
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

			// Refresh current page after deletion
			await loadProducts(paginatedProducts.pagination.page);
		} catch (err: any) {
			console.error("Delete error:", err);
			alert(`Failed to delete product: ${err.message}`);
		}
	};

	const handleProductCreated = useCallback(() => {
		// Refresh products list and go to first page to see the new product
		loadProducts(1);
	}, [loadProducts]);

	// Show loading state when no data and loading
	if (loading && paginatedProducts.data.length === 0 && !error) {
		return (
			<div className="flex justify-center items-center min-h-64">
				<div className="text-lg text-gray-600">Loading products...</div>
			</div>
		);
	}

	// Show error state
	if (error && paginatedProducts.data.length === 0) {
		return (
			<div className="flex flex-col justify-center items-center min-h-64 space-y-4">
				<div className="text-red-600 bg-red-50 p-4 rounded-md max-w-md text-center">
					<h3 className="font-semibold mb-2">
						Error Loading Products
					</h3>
					<p>{error}</p>
				</div>
				<Button onClick={() => loadProducts(1)} variant="outline">
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
						{paginatedProducts.pagination.totalCount} product
						{paginatedProducts.pagination.totalCount !== 1
							? "s"
							: ""}{" "}
						found
					</p>
				</div>
			</div>

			{/* Create Product Form */}
			<CreateForm
				onProductCreated={handleProductCreated}
				className="mb-6"
			/>

			{/* Error Banner (when products exist but there's an error) */}
			{error && paginatedProducts.data.length > 0 && (
				<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
					<p>
						<strong>Warning:</strong> {error}
					</p>
				</div>
			)}

			{/* Products Grid */}
			<ProductGrid
				paginatedProducts={paginatedProducts}
				onEdit={handleEdit}
				onDelete={handleDelete}
				onPageChange={handlePageChange}
				loading={loading}
				className="mt-6"
			/>
		</div>
	);
};

export default PageClient;
