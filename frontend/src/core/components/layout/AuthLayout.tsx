import type { ReactNode } from "react";
import { Hexagon } from "lucide-react";
import { ThemeToggle } from "@/core/components/ui/ThemeToggle";

interface AuthLayoutProps {
	children: ReactNode;
	title: string;
	subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
	return (
		<div className="min-h-screen flex flex-col justify-center bg-canvas px-4 py-12 relative text-foreground">
			<div className="absolute top-4 right-4">
				<ThemeToggle showLabel />
			</div>

			<div className="mx-auto w-full max-w-md space-y-6">
				<div className="text-center space-y-2">
					<div className="inline-flex items-center justify-center h-12 w-12 rounded-surface bg-primary-light border border-primary-border text-primary shadow-surface">
						<Hexagon className="h-7 w-7 stroke-[2]" />
					</div>
					<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
						{title}
					</h1>
					<p className="text-sm text-foreground-muted">{subtitle}</p>
				</div>

				<div className="rounded-overlay border border-subtle bg-surface p-8 shadow-surface">
					{children}
				</div>
			</div>
		</div>
	);
}
