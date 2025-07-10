import React, { useState } from "react";
import {
	ProductCreate,
	ProductCreateData,
} from "@repo/ui/components/products/create";

interface ProductFormProps {
	onSuccess?: (product: ProductCreateData) => void;
	onCancel?: () => void;
	className?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
	onSuccess,
	onCancel,
	className,
}) => {
	const [isVisible, setIsVisible] = useState(true);
	const apiBaseUrl =
		import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

	const handleProductCreated = (product: ProductCreateData) => {
		console.log("Product created successfully:", product);

		// Call the success callback if provided
		if (onSuccess) {
			onSuccess(product);
		}

		// Optionally hide the form after successful creation
		// setIsVisible(false);
	};

	const handleCancel = () => {
		console.log("Product creation cancelled");

		if (onCancel) {
			onCancel();
		} else {
			// Default behavior: hide the form
			setIsVisible(false);
		}
	};

	const handleToggleForm = () => {
		setIsVisible(!isVisible);
	};

	return (
		<div className={className}>
			{/* Toggle Button */}
			<div className="mb-4">
				<button
					onClick={handleToggleForm}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
				>
					{isVisible ? "Hide Form" : "Add New Product"}
				</button>
			</div>

			{/* Product Create Form */}
			{isVisible && (
				<div className="max-w-2xl">
					<ProductCreate
						onSuccess={handleProductCreated}
						onCancel={handleCancel}
						apiEndpoint={`${apiBaseUrl}/api/products`}
						className="shadow-lg"
					/>
				</div>
			)}
		</div>
	);
};

export default ProductForm;
