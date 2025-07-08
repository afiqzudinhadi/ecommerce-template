import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { Button } from "../button";
import { cn } from "@repo/ui/lib/utils";

// Base interface that all table records should extend
export interface BaseRecord {
	id: string;
	created_at?: string;
	updated_at?: string;
}

// Pagination information interface
export interface PaginationInfo {
	page: number;
	limit: number;
	totalCount: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

// Paginated response interface
export interface PaginatedResponse<T> {
	data: T[];
	pagination: PaginationInfo;
}

// Configuration for how to display fields
export interface FieldConfig<T = any> {
	key: keyof T;
	label: string;
	type?: "text" | "currency" | "date" | "boolean" | "image" | "status";
	format?: (value: any) => string;
	className?: string;
	hide?: boolean;
}

// Configuration for actions
export interface ActionConfig<T = any> {
	label: string;
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link";
	size?: "default" | "sm" | "lg" | "icon";
	onClick: (record: T) => void;
	className?: string;
	show?: (record: T) => boolean;
}

// Pagination controls component
interface PaginationControlsProps {
	pagination: PaginationInfo;
	onPageChange: (page: number) => void;
	loading?: boolean;
	className?: string;
}

export function PaginationControls({
	pagination,
	onPageChange,
	loading = false,
	className,
}: PaginationControlsProps) {
	const {
		page,
		totalPages,
		hasNextPage,
		hasPreviousPage,
		totalCount,
		limit,
	} = pagination;

	// Calculate visible page numbers
	const getVisiblePages = () => {
		const delta = 2; // Number of pages to show on each side of current page
		const range = [];
		const rangeWithDots = [];

		for (
			let i = Math.max(2, page - delta);
			i <= Math.min(totalPages - 1, page + delta);
			i++
		) {
			range.push(i);
		}

		if (page - delta > 2) {
			rangeWithDots.push(1, "...");
		} else {
			rangeWithDots.push(1);
		}

		rangeWithDots.push(...range);

		if (page + delta < totalPages - 1) {
			rangeWithDots.push("...", totalPages);
		} else if (totalPages > 1) {
			rangeWithDots.push(totalPages);
		}

		return rangeWithDots;
	};

	const startItem = (page - 1) * limit + 1;
	const endItem = Math.min(page * limit, totalCount);

	return (
		<div
			className={cn(
				"flex flex-col sm:flex-row items-center justify-between gap-4",
				className
			)}
		>
			{/* Results info */}
			<div className="text-sm text-gray-700">
				Showing {startItem} to {endItem} of {totalCount} results
			</div>

			{/* Pagination controls */}
			<div className="flex items-center gap-2">
				{/* Previous button */}
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(page - 1)}
					disabled={!hasPreviousPage || loading}
				>
					Previous
				</Button>

				{/* Page numbers */}
				<div className="flex items-center gap-1">
					{getVisiblePages().map((pageNum, index) => (
						<span key={index}>
							{pageNum === "..." ? (
								<span className="px-2 py-1 text-gray-500">
									...
								</span>
							) : (
								<Button
									variant={
										pageNum === page ? "default" : "outline"
									}
									size="sm"
									onClick={() =>
										onPageChange(pageNum as number)
									}
									disabled={loading}
									className="min-w-[2.5rem]"
								>
									{pageNum}
								</Button>
							)}
						</span>
					))}
				</div>

				{/* Next button */}
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(page + 1)}
					disabled={!hasNextPage || loading}
				>
					Next
				</Button>
			</div>
		</div>
	);
}

interface TableShowProps<T extends BaseRecord> {
	record: T;
	title: string | ((record: T) => string);
	fields: FieldConfig<T>[];
	actions?: ActionConfig<T>[];
	className?: string;
	showId?: boolean;
	statusField?: keyof T;
	imageField?: keyof T;
}

export function TableShow<T extends BaseRecord>({
	record,
	title,
	fields,
	actions = [],
	className,
	showId = true,
	statusField,
	imageField,
}: TableShowProps<T>) {
	const getTitle = () => {
		return typeof title === "function" ? title(record) : title;
	};

	const formatValue = (value: any, field: FieldConfig<T>) => {
		if (value === null || value === undefined) return "N/A";

		if (field.format) {
			return field.format(value);
		}

		switch (field.type) {
			case "currency":
				return `$${Number(value).toFixed(2)}`;
			case "date":
				return new Date(value).toLocaleDateString();
			case "boolean":
				return value ? "Yes" : "No";
			default:
				return String(value);
		}
	};

	const getStatusComponent = () => {
		if (!statusField) return null;

		const status = record[statusField];
		const isPublished =
			status === true || status === "published" || status === "active";

		if (isPublished) return null;

		return (
			<span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
				{status === false || status === "draft"
					? "Draft"
					: String(status)}
			</span>
		);
	};

	const getImageComponent = () => {
		if (!imageField) return null;

		const imageUrl = record[imageField] as string;
		if (!imageUrl) return null;

		return (
			<div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
				<img
					src={imageUrl}
					alt={getTitle()}
					className="w-full h-full object-cover"
				/>
			</div>
		);
	};

	const visibleActions = actions.filter(
		(action) => !action.show || action.show(record)
	);

	return (
		<Card className={cn("w-full max-w-md", className)}>
			<CardHeader>
				<CardTitle className="text-xl font-bold">
					{getTitle()}
				</CardTitle>
				{getStatusComponent()}
			</CardHeader>
			<CardContent className="space-y-4">
				{getImageComponent()}

				<div className="space-y-2">
					{fields
						.filter((field) => !field.hide)
						.map((field) => {
							const value = record[field.key];

							if (field.type === "image") {
								return value ? (
									<div
										key={String(field.key)}
										className="w-full"
									>
										<img
											src={String(value)}
											alt={field.label}
											className="w-full h-32 object-cover rounded"
										/>
									</div>
								) : null;
							}

							return (
								<div
									key={String(field.key)}
									className={cn(
										"flex justify-between items-start",
										field.className
									)}
								>
									<span className="text-sm font-medium text-gray-600">
										{field.label}:
									</span>
									<span
										className={cn(
											"text-sm",
											field.type === "currency" &&
												"font-bold text-green-600"
										)}
									>
										{formatValue(value, field)}
									</span>
								</div>
							);
						})}

					{showId && (
						<div className="flex justify-between items-center pt-2 border-t">
							<span className="text-xs text-gray-500">ID:</span>
							<span className="text-xs text-gray-500 font-mono">
								{record.id}
							</span>
						</div>
					)}
				</div>

				{visibleActions.length > 0 && (
					<div className="flex gap-2 pt-4">
						{visibleActions.map((action, index) => (
							<Button
								key={index}
								variant={action.variant || "outline"}
								size={action.size || "sm"}
								onClick={() => action.onClick(record)}
								className={cn("flex-1", action.className)}
							>
								{action.label}
							</Button>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

// Updated Grid version for paginated records
interface TableGridProps<T extends BaseRecord> {
	paginatedData: PaginatedResponse<T>;
	title: string | ((record: T) => string);
	fields: FieldConfig<T>[];
	actions?: ActionConfig<T>[];
	onPageChange: (page: number) => void;
	loading?: boolean;
	className?: string;
	showId?: boolean;
	statusField?: keyof T;
	imageField?: keyof T;
	emptyMessage?: string;
}

export function TableGrid<T extends BaseRecord>({
	paginatedData,
	title,
	fields,
	actions,
	onPageChange,
	loading = false,
	className,
	showId,
	statusField,
	imageField,
	emptyMessage = "No records found.",
}: TableGridProps<T>) {
	const { data: records, pagination } = paginatedData;

	if (records.length === 0 && !loading) {
		return (
			<div className="space-y-6">
				<div className="text-center py-8 text-gray-500">
					{emptyMessage}
				</div>
				{pagination.totalCount > 0 && (
					<PaginationControls
						pagination={pagination}
						onPageChange={onPageChange}
						loading={loading}
					/>
				)}
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Loading state overlay */}
			{loading && (
				<div className="text-center py-4">
					<div className="text-gray-500">Loading...</div>
				</div>
			)}

			{/* Grid of records */}
			<div
				className={cn(
					"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
					loading && "opacity-50 pointer-events-none",
					className
				)}
			>
				{records.map((record) => (
					<TableShow
						key={record.id}
						record={record}
						title={title}
						fields={fields}
						actions={actions}
						showId={showId}
						statusField={statusField}
						imageField={imageField}
					/>
				))}
			</div>

			{/* Pagination controls */}
			{pagination.totalPages > 1 && (
				<PaginationControls
					pagination={pagination}
					onPageChange={onPageChange}
					loading={loading}
				/>
			)}
		</div>
	);
}

// Simple non-paginated grid for backward compatibility
interface SimpleTableGridProps<T extends BaseRecord> {
	records: T[];
	title: string | ((record: T) => string);
	fields: FieldConfig<T>[];
	actions?: ActionConfig<T>[];
	className?: string;
	showId?: boolean;
	statusField?: keyof T;
	imageField?: keyof T;
	emptyMessage?: string;
}

export function SimpleTableGrid<T extends BaseRecord>({
	records,
	title,
	fields,
	actions,
	className,
	showId,
	statusField,
	imageField,
	emptyMessage = "No records found.",
}: SimpleTableGridProps<T>) {
	if (records.length === 0) {
		return (
			<div className="text-center py-8 text-gray-500">{emptyMessage}</div>
		);
	}

	return (
		<div
			className={cn(
				"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
				className
			)}
		>
			{records.map((record) => (
				<TableShow
					key={record.id}
					record={record}
					title={title}
					fields={fields}
					actions={actions}
					showId={showId}
					statusField={statusField}
					imageField={imageField}
				/>
			))}
		</div>
	);
}

export type {
	TableShowProps,
	TableGridProps,
	SimpleTableGridProps,
	PaginationControlsProps,
};
