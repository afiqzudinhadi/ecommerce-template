import React from "react";
import {
	TableShow,
	TableGrid,
	FieldConfig,
	ActionConfig,
	BaseRecord,
} from "../template/table-show";

export interface User extends BaseRecord {
	name: string;
	email: string;
	role: string;
	isActive?: boolean;
	lastLogin?: string;
}

const userFields: FieldConfig<User>[] = [
	{ key: "email", label: "Email", type: "text" },
	{ key: "role", label: "Role", type: "text" },
	{ key: "lastLogin", label: "Last Login", type: "date" },
];

interface UserShowProps {
	user: User;
	onEdit?: (user: User) => void;
	onDeactivate?: (userId: string) => void;
	className?: string;
}

export function UserShow({
	user,
	onEdit,
	onDeactivate,
	className,
}: UserShowProps) {
	const actions: ActionConfig<User>[] = [
		...(onEdit
			? [
					{
						label: "Edit",
						variant: "outline" as const,
						onClick: onEdit,
					},
				]
			: []),
		...(onDeactivate
			? [
					{
						label: "Deactivate",
						variant: "destructive" as const,
						onClick: (u: User) => onDeactivate(u.id),
						show: (u: User) => u.isActive !== false,
					},
				]
			: []),
	];

	return (
		<TableShow
			record={user}
			title={(u) => u.name}
			fields={userFields}
			actions={actions}
			className={className}
			statusField="isActive"
		/>
	);
}
