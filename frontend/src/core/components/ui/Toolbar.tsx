import type { HTMLAttributes } from "react";
import { cn } from "@/core/utils/cn";

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {}

export function Toolbar({ className, children, ...props }: ToolbarProps) {
	return (
		<div
			className={cn("bg-surface rounded-surface p-4 space-y-3", className)}
			{...props}
		>
			{children}
		</div>
	);
}
