import type { HTMLAttributes } from "react";
import { cn } from "@/core/utils/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	variant?: "surface" | "interactive" | "ghost";
}

export function Card({
	className,
	variant = "surface",
	children,
	...props
}: CardProps) {
	const variants = {
		surface: "rounded-surface border border-subtle bg-surface shadow-surface",
		interactive:
			"rounded-surface border border-subtle bg-surface shadow-surface hover:border-strong transition-colors cursor-pointer",
		ghost: "border-0 bg-transparent shadow-none p-0",
	};

	return (
		<div
			className={cn(variants[variant], variant !== "ghost" && "p-6", className)}
			{...props}
		>
			{children}
		</div>
	);
}

export function CardHeader({
	className,
	children,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("flex flex-col space-y-1 pb-4", className)} {...props}>
			{children}
		</div>
	);
}

export function CardTitle({
	className,
	children,
	...props
}: HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h3
			className={cn(
				"text-base sm:text-lg font-semibold tracking-tight text-foreground",
				className,
			)}
			{...props}
		>
			{children}
		</h3>
	);
}

export function CardDescription({
	className,
	children,
	...props
}: HTMLAttributes<HTMLParagraphElement>) {
	return (
		<p
			className={cn("text-xs sm:text-sm text-foreground-muted", className)}
			{...props}
		>
			{children}
		</p>
	);
}

export function CardContent({
	className,
	children,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("pt-1", className)} {...props}>
			{children}
		</div>
	);
}

export function CardFooter({
	className,
	children,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("flex items-center pt-4", className)} {...props}>
			{children}
		</div>
	);
}
