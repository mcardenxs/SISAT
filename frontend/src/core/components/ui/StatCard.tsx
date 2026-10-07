import type { ReactNode } from "react";
import { cn } from "@/core/utils/cn";

export interface StatCardProps {
	label: string;
	value: string | number;
	description?: string;
	icon?: ReactNode;
	className?: string;
}

export function StatCard({
	label,
	value,
	description,
	icon,
	className,
}: StatCardProps) {
	return (
		<div
			className={cn(
				"bg-surface rounded-surface border border-subtle shadow-surface p-5 space-y-2",
				className,
			)}
		>
			<div className="flex items-center justify-between gap-2">
				<span className="text-xs font-medium text-foreground-muted">
					{label}
				</span>
				{icon && <div className="text-foreground-subtle shrink-0">{icon}</div>}
			</div>
			<div className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
				{value}
			</div>
			{description && (
				<p className="text-xs text-foreground-subtle leading-normal">
					{description}
				</p>
			)}
		</div>
	);
}
