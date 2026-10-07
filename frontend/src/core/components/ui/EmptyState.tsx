import type { ReactNode } from "react";
import { cn } from "@/core/utils/cn";

export interface EmptyStateProps {
	title: string;
	description?: string;
	icon?: ReactNode;
	action?: ReactNode;
	className?: string;
}

export function EmptyState({
	title,
	description,
	icon,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"bg-surface-subtle border border-subtle rounded-surface p-10 text-center space-y-3",
				className,
			)}
		>
			{icon && (
				<div className="flex justify-center text-foreground-subtle">{icon}</div>
			)}
			<div className="space-y-1">
				<h3 className="text-base font-semibold text-foreground">{title}</h3>
				{description && (
					<p className="text-xs text-foreground-muted max-w-sm mx-auto">
						{description}
					</p>
				)}
			</div>
			{action && <div className="pt-2">{action}</div>}
		</div>
	);
}
