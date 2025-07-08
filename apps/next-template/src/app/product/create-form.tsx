"use client";
import React, { useState } from "react";
import {
	ProductCreate,
	ProductCreateData,
} from "@repo/ui/components/products/create";
import { Button } from "@repo/ui/components/button";

interface CreateFormProps {
	onProductCreated?: () => void;
	className?: string;
}

const CreateForm: React.FC<CreateFormProps> = ({
	onProductCreated,
	className,
}) => {
	const [showForm, setShowForm] = useState(false);

	const handleProductCreated = (product: ProductCreateData) => {
		console.log("Product created successfully:", product);

		// Hide the form after successful creation
		setShowForm(false);

		// Trigger parent to refresh products list
		if (onProductCreated) {
			onProductCreated();
		}
	};

	const handleCancel = () => {
		setShowForm(false);
	};

	const toggleForm = () => {
		setShowForm(!showForm);
	};

	return (
		<div className={className}>
			{/* Toggle Button */}
			<div className="mb-6">
				<Button
					onClick={toggleForm}
					variant={showForm ? "outline" : "default"}
				>
					{showForm ? "Cancel" : "Add New Product"}
				</Button>
			</div>

			{/* Create Form */}
			{showForm && (
				<div className="mb-6 max-w-md">
					<ProductCreate
						onSuccess={handleProductCreated}
						onCancel={handleCancel}
						apiEndpoint="/api/products"
						className="bg-white border rounded-lg shadow-sm"
					/>
				</div>
			)}
		</div>
	);
};

export default CreateForm;
