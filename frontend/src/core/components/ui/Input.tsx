import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/core/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, helperText, className, id, ...props }, ref) => {
		const inputId =
			id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

		return (
			<div className="w-full space-y-1.5">
				{label && (
					<label
						htmlFor={inputId}
						className="block text-xs font-medium text-foreground-muted"
					>
						{label}
					</label>
				)}
				<input
					ref={ref}
					id={inputId}
					className={cn(
						"w-full rounded-control border bg-surface px-3.5 py-2 text-sm text-foreground placeholder-foreground-subtle shadow-surface transition-colors",
						"focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
						"disabled:cursor-not-allowed disabled:opacity-50",
						error
							? "border-danger focus:border-danger focus:ring-danger/30"
							: "border-border-strong hover:border-foreground-muted",
						className,
					)}
					aria-invalid={!!error}
					aria-describedby={
						error
							? `${inputId}-error`
							: helperText
								? `${inputId}-helper`
								: undefined
					}
					{...props}
				/>
				{error && (
					<p
						id={`${inputId}-error`}
						className="text-xs text-danger font-medium"
					>
						{error}
					</p>
				)}
				{!error && helperText && (
					<p
						id={`${inputId}-helper`}
						className="text-xs text-foreground-subtle"
					>
						{helperText}
					</p>
				)}
			</div>
		);
	},
);

Input.displayName = "Input";
