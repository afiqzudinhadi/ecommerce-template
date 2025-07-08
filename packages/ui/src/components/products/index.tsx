import {
	TableShow,
	TableGrid,
	SimpleTableGrid,
	FieldConfig,
	ActionConfig,
	BaseRecord,
	PaginatedResponse,
} from "../template/table-show";

export interface Product extends BaseRecord {
	name: string;
	description: string;
	price: number;
	imageUrl?: string;
	isPublished?: boolean;
}

const productFields: FieldConfig<Product>[] = [
	{ key: "description", label: "Description", type: "text" },
	{ key: "price", label: "Price", type: "currency" },
];

interface ProductShowProps {
	product: Product;
	onEdit?: (product: Product) => void;
	onDelete?: (productId: string) => void;
	className?: string;
}

export function ProductShow({
	product,
	onEdit,
	onDelete,
	className,
}: ProductShowProps) {
	const actions: ActionConfig<Product>[] = [
		...(onEdit
			? [
					{
						label: "Edit",
						variant: "outline" as const,
						onClick: onEdit,
					},
				]
			: []),
		...(onDelete
			? [
					{
						label: "Delete",
						variant: "destructive" as const,
						onClick: (p: Product) => onDelete(p.id),
					},
				]
			: []),
	];

	return (
		<TableShow
			record={product}
			title={(p) => p.name}
			fields={productFields}
			actions={actions}
			className={className}
			statusField="isPublished"
			imageField="imageUrl"
		/>
	);
}

// Updated paginated ProductGrid
export function ProductGrid({
	paginatedProducts,
	onEdit,
	onDelete,
	onPageChange,
	loading,
	className,
}: {
	paginatedProducts: PaginatedResponse<Product>;
	onEdit?: (product: Product) => void;
	onDelete?: (productId: string) => void;
	onPageChange: (page: number) => void;
	loading?: boolean;
	className?: string;
}) {
	const actions: ActionConfig<Product>[] = [
		...(onEdit
			? [
					{
						label: "Edit",
						variant: "outline" as const,
						onClick: onEdit,
					},
				]
			: []),
		...(onDelete
			? [
					{
						label: "Delete",
						variant: "destructive" as const,
						onClick: (p: Product) => onDelete(p.id),
					},
				]
			: []),
	];

	return (
		<TableGrid
			paginatedData={paginatedProducts}
			title={(p) => p.name}
			fields={productFields}
			actions={actions}
			onPageChange={onPageChange}
			loading={loading}
			className={className}
			statusField="isPublished"
			imageField="imageUrl"
			emptyMessage="No products found."
		/>
	);
}

// Simple non-paginated version for backward compatibility
export function SimpleProductGrid({
	products,
	onEdit,
	onDelete,
	className,
}: {
	products: Product[];
	onEdit?: (product: Product) => void;
	onDelete?: (productId: string) => void;
	className?: string;
}) {
	const actions: ActionConfig<Product>[] = [
		...(onEdit
			? [
					{
						label: "Edit",
						variant: "outline" as const,
						onClick: onEdit,
					},
				]
			: []),
		...(onDelete
			? [
					{
						label: "Delete",
						variant: "destructive" as const,
						onClick: (p: Product) => onDelete(p.id),
					},
				]
			: []),
	];

	return (
		<SimpleTableGrid
			records={products}
			title={(p) => p.name}
			fields={productFields}
			actions={actions}
			className={className}
			statusField="isPublished"
			imageField="imageUrl"
			emptyMessage="No products found."
		/>
	);
}
