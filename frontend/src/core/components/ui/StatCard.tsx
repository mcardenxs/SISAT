import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/core/utils/cn";
import { ArrowUpRight } from "lucide-react";

export interface StatCardProps {
	label: string;
	value: string | number;
	description?: string;
	icon?: ReactNode;
	to?: string;
	onClick?: () => void;
	className?: string;
}

export function StatCard({
	label,
	value,
	description,
	icon,
	to,
	onClick,
	className,
}: StatCardProps) {
	const content = (
		<>
			<div className="flex items-center justify-between gap-2">
				<span className="text-xs font-medium text-foreground-muted group-hover:text-foreground transition-colors">
					{label}
				</span>
				<div className="flex items-center gap-1.5">
					{icon && <div className="text-foreground-subtle shrink-0">{icon}</div>}
					{to && (
						<ArrowUpRight className="h-3.5 w-3.5 text-foreground-subtle group-hover:text-primary transition-colors opacity-60 group-hover:opacity-100" />
					)}
				</div>
			</div>
			<div className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
				{value}
			</div>
			{description && (
				<p className="text-xs text-foreground-subtle leading-normal">
					{description}
				</p>
			)}
		</>
	);

	const baseClasses = cn(
		"bg-surface rounded-surface border border-subtle shadow-surface p-5 space-y-2 block text-left transition-all",
		(to || onClick) &&
			"cursor-pointer hover:border-primary/50 hover:bg-surface-subtle/70 hover:shadow-md active:scale-[0.99] group",
		className,
	);

	if (to) {
		return (
			<Link to={to} className={baseClasses}>
				{content}
			</Link>
		);
	}

	if (onClick) {
		return (
			<button type="button" onClick={onClick} className={baseClasses}>
				{content}
			</button>
		);
	}

	return <div className={baseClasses}>{content}</div>;
}
