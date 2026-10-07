import type { ReactNode } from "react";
import {
	AlertCircle,
	CheckCircle2,
	AlertTriangle,
	Info as InfoIcon,
} from "lucide-react";
import { cn } from "@/core/utils/cn";

export interface AlertProps {
	variant?: "info" | "success" | "warning" | "danger";
	title?: string;
	children: ReactNode;
	action?: ReactNode;
	className?: string;
}

export function Alert({
	variant = "info",
	title,
	children,
	action,
	className,
}: AlertProps) {
	const variants = {
		info: {
			container: "bg-info-subtle border-info-border text-foreground",
			icon: <InfoIcon className="h-4 w-4 text-info shrink-0 mt-0.5" />,
		},
		success: {
			container: "bg-success-subtle border-success-border text-foreground",
			icon: <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />,
		},
		warning: {
			container: "bg-warning-subtle border-warning-border text-foreground",
			icon: <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />,
		},
		danger: {
			container: "bg-danger-subtle border-danger-border text-foreground",
			icon: <AlertCircle className="h-4 w-4 text-danger shrink-0 mt-0.5" />,
		},
	};

	const current = variants[variant];

	return (
		<div
			role="alert"
			className={cn(
				"rounded-surface border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs",
				current.container,
				className,
			)}
		>
			<div className="flex items-start gap-3">
				{current.icon}
				<div className="space-y-0.5">
					{title && <p className="font-semibold text-foreground">{title}</p>}
					<div className="text-foreground-muted">{children}</div>
				</div>
			</div>
			{action && <div className="shrink-0 self-start sm:self-auto">{action}</div>}
		</div>
	);
}
