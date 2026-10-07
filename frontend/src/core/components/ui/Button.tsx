import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/core/utils/cn";
import { Spinner } from "./Spinner";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?:
		| "primary"
		| "secondary"
		| "outline"
		| "danger"
		| "ghost"
		| "surface";
	size?: "sm" | "md" | "lg";
	isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			children,
			className,
			variant = "primary",
			size = "md",
			isLoading = false,
			disabled,
			type = "button",
			...props
		},
		ref,
	) => {
		const baseStyles =
			"inline-flex items-center justify-center font-medium rounded-control transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-canvas disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none";

		const variants = {
			primary:
				"bg-primary text-white hover:bg-primary-hover active:opacity-90 shadow-surface",
			secondary:
				"bg-surface-subtle text-foreground hover:bg-surface-muted active:opacity-90 border border-border-strong",
			outline:
				"border border-border-strong bg-transparent text-foreground hover:bg-surface-subtle",
			danger:
				"bg-danger text-white hover:opacity-90 active:opacity-80 shadow-surface",
			ghost:
				"bg-transparent text-foreground-muted hover:text-foreground hover:bg-surface-muted",
			surface:
				"bg-surface text-foreground hover:bg-surface-muted border border-border-subtle shadow-surface",
		};

		const sizes = {
			sm: "text-xs px-2.5 py-1.5 gap-1.5",
			md: "text-sm px-4 py-2 gap-2",
			lg: "text-base px-5 py-2.5 gap-2.5",
		};

		return (
			<button
				ref={ref}
				type={type}
				disabled={disabled || isLoading}
				className={cn(baseStyles, variants[variant], sizes[size], className)}
				{...props}
			>
				{isLoading && <Spinner size="sm" className="mr-1 text-current" />}
				{children}
			</button>
		);
	},
);

Button.displayName = "Button";
