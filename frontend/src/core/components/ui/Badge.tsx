import type { HTMLAttributes } from "react";
import { cn } from "@/core/utils/cn";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	variant?:
		| "neutral"
		| "default"
		| "info"
		| "success"
		| "warning"
		| "danger"
		| "purple";
}

export function Badge({
	className,
	variant = "neutral",
	children,
	...props
}: BadgeProps) {
	const variants = {
		neutral: "bg-surface-muted text-foreground border-border-subtle",
		default: "bg-surface-muted text-foreground border-border-subtle",
		info: "bg-info-subtle text-info border-info-border",
		purple: "bg-info-subtle text-info border-info-border",
		success: "bg-success-subtle text-success border-success-border",
		warning: "bg-warning-subtle text-warning border-warning-border",
		danger: "bg-danger-subtle text-danger border-danger-border",
	};

	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium tracking-normal transition-colors",
				variants[variant],
				className,
			)}
			{...props}
		>
			{children}
		</span>
	);
}
