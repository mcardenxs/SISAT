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
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
			<div
				className={cn(
					"relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl transition-all",
					className,
				)}
			>
				<div className="flex items-center justify-between pb-4 border-b border-slate-800">
					<h3 className="text-lg font-semibold text-white tracking-tight">
						{title}
					</h3>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
					>
						<X className="h-4 w-4" />
					</button>
				</div>
				<div className="pt-4">{children}</div>
			</div>
		</div>
	);
}
