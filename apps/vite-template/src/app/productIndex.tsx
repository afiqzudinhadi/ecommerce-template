import React, { useEffect, useState, useCallback } from "react";
import { ProductGrid } from "@repo/ui/components/products/index";
import { PaginatedResponse } from "@repo/ui/components/template/table-show";

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

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const fetchProducts = async (
	page: number = 1,
	limit: number = 10
): Promise<PaginatedResponse<Product>> => {
	const response = await fetch(
		`${apiBaseUrl}/api/products?page=${page}&limit=${limit}`
	);
	if (!response.ok) {
		throw new Error("Failed to fetch products");
	}
	return response.json();
};

const ProductIndex: React.FC = () => {
	const [paginatedProducts, setPaginatedProducts] = useState<
		PaginatedResponse<Product>
	>({
		data: [],
		pagination: {
			page: 1,
			limit: 10,
			totalCount: 0,
			totalPages: 0,
			hasNextPage: false,
			hasPreviousPage: false,
		},
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadProducts = useCallback(async (page: number = 1) => {
		try {
			setLoading(true);
			const result = await fetchProducts(page);
			setPaginatedProducts(result);
			setError(null);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadProducts(1);
	}, [loadProducts]);

	const handlePageChange = (page: number) => {
		loadProducts(page);
	};

	const handleEdit = (product: Product) => {
		// TODO: Implement edit functionality for Vite app
		console.log("Edit product:", product);
	};

	const handleDelete = async (productId: string) => {
		if (!confirm("Are you sure you want to delete this product?")) {
			return;
		}

		try {
			const response = await fetch(
				`${apiBaseUrl}/api/products/${productId}`,
				{
					method: "DELETE",
				}
			);

			if (!response.ok) {
				throw new Error("Failed to delete product");
			}

			// Refresh current page
			loadProducts(paginatedProducts.pagination.page);
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : "An error occurred";
			console.error("Delete error:", errorMessage);
			alert("Failed to delete product: " + errorMessage);
		}
	};

	if (loading && paginatedProducts.data.length === 0) {
		return (
			<div className="flex justify-center items-center min-h-64">
				<div className="text-lg text-gray-600">Loading products...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col justify-center items-center min-h-64 space-y-4">
				<div className="text-red-600 bg-red-50 p-4 rounded-md max-w-md text-center">
					<h3 className="font-semibold mb-2">
						Error Loading Products
					</h3>
					<p>{error}</p>
				</div>
				<button
					onClick={() => loadProducts(1)}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
				>
					Try Again
				</button>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-3xl font-bold">Products</h2>
					<p className="text-gray-600 mt-1">
						{paginatedProducts.pagination.totalCount} product
						{paginatedProducts.pagination.totalCount !== 1
							? "s"
							: ""}{" "}
						found
					</p>
				</div>
			</div>

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

export default ProductIndex;
