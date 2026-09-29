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
						className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
					>
						{label}
					</label>
				)}
				<input
					ref={ref}
					id={inputId}
					className={cn(
						"w-full rounded-lg border bg-slate-900/80 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 shadow-sm transition-colors",
						"focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
						"disabled:cursor-not-allowed disabled:opacity-50",
						error
							? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30"
							: "border-slate-800 hover:border-slate-700",
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
						className="text-xs text-rose-400 font-medium"
					>
						{error}
					</p>
				)}
				{!error && helperText && (
					<p id={`${inputId}-helper`} className="text-xs text-slate-400">
						{helperText}
					</p>
				)}
			</div>
		);
	},
);

Input.displayName = "Input";
