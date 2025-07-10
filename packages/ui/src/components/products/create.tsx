import { CreateForm, FormField, FormData } from "../template/create-form";

// Product-specific form fields configuration based on database schema
const productFields: FormField[] = [
	{
		key: "name",
		label: "Product Name",
		type: "text",
		required: true,
		placeholder: "Enter product name",
		validation: {
			minLength: 2,
			maxLength: 255,
		},
		helpText: "A clear, descriptive name for your product",
	},
	{
		key: "price",
		label: "Price",
		type: "number",
		required: true,
		placeholder: "0.00",
		validation: {
			min: 0,
			max: 99999999.99, // Based on numeric(10, 2) from schema
		},
		helpText: "Price in USD (up to 8 digits before decimal, 2 after)",
	},
	{
		key: "description",
		label: "Description",
		type: "textarea",
		placeholder: "Enter detailed product description",
		validation: {
			maxLength: 2000,
		},
		helpText: "Detailed description of the product features and benefits",
	},
	{
		key: "imageUrl",
		label: "Image URL",
		type: "url",
		placeholder: "https://example.com/product-image.jpg",
		helpText: "URL to the main product image",
	},
	{
		key: "isPublished",
		label: "Published Status",
		type: "checkbox",
		placeholder: "Make this product visible to customers",
		helpText: "Uncheck to save as draft (defaults to false)",
	},
];

export interface ProductCreateData extends FormData {
	name: string;
	price: number;
	description: string;
	imageUrl: string;
	isPublished: boolean;
}

interface ProductCreateProps {
	onSuccess?: (product: ProductCreateData) => void;
	onCancel?: () => void;
	loading?: boolean;
	className?: string;
	apiEndpoint?: string;
}

export function ProductCreate({
	onSuccess,
	onCancel,
	loading = false,
	className,
	apiEndpoint = "/api/products",
}: ProductCreateProps) {
	const handleSubmit = async (data: FormData): Promise<void> => {
		// Transform and validate the data according to database schema
		const productData: ProductCreateData = {
			name: data.name as string,
			price: Number(data.price),
			description: data.description as string,
			imageUrl: data.imageUrl as string,
			isPublished: data.isPublished ? Boolean(data.isPublished) : false,
		};

		// Make API call
		const response = await fetch(apiEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(productData),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(
				errorData.message ||
					`Failed to create product (${response.status})`
			);
		}

		const createdProduct = await response.json();

		if (onSuccess) {
			onSuccess(createdProduct);
		}
	};

	return (
		<CreateForm
			title="Create New Product"
			fields={productFields}
			onSubmit={handleSubmit}
			onCancel={onCancel}
			loading={loading}
			submitText="Create Product"
			cancelText="Cancel"
			className={className}
		/>
	);
}

// Export individual field configurations for reuse
export const productFormFields = productFields;

export type { ProductCreateProps };
