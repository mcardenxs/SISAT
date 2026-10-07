import type { ReactNode } from "react";
import { cn } from "@/core/utils/cn";

export interface PageHeaderProps {
	title: string;
	description?: string;
	actions?: ReactNode;
	className?: string;
}

export function PageHeader({
	title,
	description,
	actions,
	className,
}: PageHeaderProps) {
	return (
		<div
			className={cn(
				"flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6",
				className,
			)}
		>
			<div className="space-y-1">
				<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
					{title}
				</h1>
				{description && (
					<p className="text-sm text-foreground-muted">{description}</p>
				)}
			</div>
			{actions && (
				<div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
					{actions}
				</div>
			)}
		</div>
	);
}
