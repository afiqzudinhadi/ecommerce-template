import React, { useState } from "react";
import { Button } from "../button";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { cn } from "@repo/ui/lib/utils";

// Base interface for form fields
export interface FormField {
	key: string;
	label: string;
	type:
		| "text"
		| "number"
		| "email"
		| "password"
		| "textarea"
		| "url"
		| "tel"
		| "date"
		| "select"
		| "checkbox";
	required?: boolean;
	placeholder?: string;
	options?: { value: string; label: string }[]; // For select fields
	validation?: {
		min?: number;
		max?: number;
		pattern?: string;
		minLength?: number;
		maxLength?: number;
	};
	className?: string;
	disabled?: boolean;
	helpText?: string;
}

// Generic form data interface
export interface FormData {
	[key: string]: string | number | boolean;
}

interface CreateFormProps {
	title: string;
	fields: FormField[];
	onSubmit: (data: FormData) => Promise<void>;
	onCancel?: () => void;
	loading?: boolean;
	submitText?: string;
	cancelText?: string;
	className?: string;
	initialData?: FormData;
}

export function CreateForm({
	title,
	fields,
	onSubmit,
	onCancel,
	loading = false,
	submitText = "Create",
	cancelText = "Cancel",
	className,
	initialData = {},
}: CreateFormProps) {
	const [formData, setFormData] = useState<FormData>(() => {
		const initial: FormData = {};
		fields.forEach((field) => {
			initial[field.key] =
				initialData[field.key] ||
				(field.type === "number"
					? 0
					: field.type === "checkbox"
						? false
						: "");
		});
		return initial;
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const validateField = (
		field: FormField,
		value: string | number | boolean
	): string | null => {
		if (
			field.required &&
			(!value || (typeof value === "string" && !value.trim()))
		) {
			return `${field.label} is required`;
		}

		if (field.validation) {
			const { min, max, pattern, minLength, maxLength } =
				field.validation;

			if (field.type === "number" && typeof value === "number") {
				if (min !== undefined && value < min) {
					return `${field.label} must be at least ${min}`;
				}
				if (max !== undefined && value > max) {
					return `${field.label} must be at most ${max}`;
				}
			}

			if (typeof value === "string") {
				if (minLength !== undefined && value.length < minLength) {
					return `${field.label} must be at least ${minLength} characters`;
				}
				if (maxLength !== undefined && value.length > maxLength) {
					return `${field.label} must be at most ${maxLength} characters`;
				}
				if (pattern && !new RegExp(pattern).test(value)) {
					return `${field.label} format is invalid`;
				}
			}
		}

		return null;
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		fields.forEach((field) => {
			const error = validateField(field, formData[field.key]);
			if (error) {
				newErrors[field.key] = error;
			}
		});

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (
		key: string,
		value: string | number | boolean
	) => {
		setFormData((prev) => ({ ...prev, [key]: value }));

		// Clear error when user starts typing
		if (errors[key]) {
			setErrors((prev) => ({ ...prev, [key]: "" }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);
		try {
			await onSubmit(formData);

			// Reset form on success
			const resetData: FormData = {};
			fields.forEach((field) => {
				resetData[field.key] =
					field.type === "number"
						? 0
						: field.type === "checkbox"
							? false
							: "";
			});
			setFormData(resetData);
			setErrors({});
		} catch (error: unknown) {
			setErrors({
				submit:
					error instanceof Error
						? error.message
						: "An error occurred",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderField = (field: FormField) => {
		const isFieldDisabled = loading || isSubmitting || field.disabled;
		const fieldError = errors[field.key];

		const baseInputClasses = cn(
			"w-full mt-1 p-2 border rounded-md transition-colors",
			"focus:ring-2 focus:ring-blue-500 focus:border-transparent",
			fieldError ? "border-red-500" : "border-gray-300",
			isFieldDisabled && "opacity-50 cursor-not-allowed",
			field.className
		);

		switch (field.type) {
			case "textarea":
				return (
					<textarea
						className={baseInputClasses}
						value={String(formData[field.key] || "")}
						onChange={(e) =>
							handleInputChange(field.key, e.target.value)
						}
						disabled={isFieldDisabled}
						placeholder={field.placeholder}
						rows={3}
					/>
				);

			case "select":
				return (
					<select
						className={baseInputClasses}
						value={String(formData[field.key] || "")}
						onChange={(e) =>
							handleInputChange(field.key, e.target.value)
						}
						disabled={isFieldDisabled}
					>
						<option value="">
							{field.placeholder || `Select ${field.label}`}
						</option>
						{field.options?.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				);

			case "checkbox":
				return (
					<div className="flex items-center">
						<input
							type="checkbox"
							className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							checked={Boolean(formData[field.key])}
							onChange={(e) =>
								handleInputChange(field.key, e.target.checked)
							}
							disabled={isFieldDisabled}
						/>
						<label className="ml-2 text-sm text-gray-700">
							{field.placeholder || field.label}
						</label>
					</div>
				);

			case "number":
				return (
					<input
						type="number"
						className={baseInputClasses}
						value={
							typeof formData[field.key] === "number"
								? String(formData[field.key])
								: ""
						}
						onChange={(e) =>
							handleInputChange(
								field.key,
								parseFloat(e.target.value) || 0
							)
						}
						disabled={isFieldDisabled}
						placeholder={field.placeholder}
						min={field.validation?.min}
						max={field.validation?.max}
						step={field.type === "number" ? "any" : undefined}
					/>
				);

			default:
				return (
					<input
						type={field.type}
						className={baseInputClasses}
						value={String(formData[field.key] || "")}
						onChange={(e) =>
							handleInputChange(field.key, e.target.value)
						}
						disabled={isFieldDisabled}
						placeholder={field.placeholder}
						pattern={field.validation?.pattern}
						minLength={field.validation?.minLength}
						maxLength={field.validation?.maxLength}
					/>
				);
		}
	};

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					{fields.map((field) => (
						<div key={field.key}>
							{field.type !== "checkbox" && (
								<label className="block text-sm font-medium text-gray-700">
									{field.label}
									{field.required && (
										<span className="text-red-500 ml-1">
											*
										</span>
									)}
								</label>
							)}

							{renderField(field)}

							{errors[field.key] && (
								<p className="mt-1 text-sm text-red-600">
									{errors[field.key]}
								</p>
							)}

							{field.helpText && (
								<p className="mt-1 text-sm text-gray-500">
									{field.helpText}
								</p>
							)}
						</div>
					))}

					{errors.submit && (
						<div className="text-red-600 text-sm p-2 bg-red-50 rounded">
							{errors.submit}
						</div>
					)}

					<div className="flex gap-2 pt-4">
						{onCancel && (
							<Button
								type="button"
								variant="outline"
								onClick={onCancel}
								disabled={isSubmitting}
								className="flex-1"
							>
								{cancelText}
							</Button>
						)}
						<Button
							type="submit"
							disabled={isSubmitting}
							className="flex-1"
						>
							{isSubmitting ? "Saving..." : submitText}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}

export type { CreateFormProps };
