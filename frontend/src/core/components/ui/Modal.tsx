import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/core/utils/cn";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	className?: string;
}

export function Modal({
	isOpen,
	onClose,
	title,
	children,
	className,
}: ModalProps) {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		if (isOpen) {
			document.body.style.overflow = "hidden";
			window.addEventListener("keydown", handleKeyDown);
		}
		return () => {
			document.body.style.overflow = "unset";
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 animate-in fade-in duration-150">
			<div
				className={cn(
					"relative w-full max-w-lg rounded-overlay border border-subtle bg-surface p-6 shadow-overlay transition-all",
					className,
				)}
			>
				<div className="flex items-center justify-between pb-4 border-b border-subtle">
					<h3 className="text-lg font-semibold text-foreground tracking-tight">
						{title}
					</h3>
					<button
						type="button"
						onClick={onClose}
						className="rounded-control p-1.5 text-foreground-muted hover:text-foreground hover:bg-surface-muted transition-colors cursor-pointer"
						aria-label="Cerrar modal"
					>
						<X className="h-4 w-4" />
					</button>
				</div>
				<div className="pt-4">{children}</div>
			</div>
		</div>
	);
}
