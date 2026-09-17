import type { HTMLAttributes } from "react";
import { cn } from "@/core/utils/cn";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	variant?: "default" | "success" | "warning" | "danger" | "purple" | "info";
}

export function Badge({
	className,
	variant = "default",
	children,
	...props
}: BadgeProps) {
	const variants = {
		default: "bg-slate-800 text-slate-300 border-slate-700",
		success: "bg-emerald-950/80 text-emerald-400 border-emerald-800/60",
		warning: "bg-amber-950/80 text-amber-400 border-amber-800/60",
		danger: "bg-rose-950/80 text-rose-400 border-rose-800/60",
		purple: "bg-indigo-950/80 text-indigo-300 border-indigo-800/60",
		info: "bg-cyan-950/80 text-cyan-400 border-cyan-800/60",
	};

	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
				variants[variant],
				className,
			)}
			{...props}
		>
			{children}
		</span>
	);
}
