import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/core/utils/cn";
import { Spinner } from "./Spinner";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
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
			"inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none";

		const variants = {
			primary:
				"bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 shadow-sm",
			secondary:
				"bg-slate-800 text-slate-100 hover:bg-slate-700 active:bg-slate-900 border border-slate-700",
			outline:
				"border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800 hover:text-white",
			danger:
				"bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700 shadow-sm",
			ghost:
				"bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white",
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
