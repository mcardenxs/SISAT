import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/core/theme/store";
import { cn } from "@/core/utils/cn";

export interface ThemeToggleProps {
	className?: string;
	showLabel?: boolean;
}

export function ThemeToggle({
	className,
	showLabel = false,
}: ThemeToggleProps) {
	const { theme, toggleTheme } = useThemeStore();
	const isDark = theme === "dark";

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className={cn(
				"inline-flex items-center gap-2 rounded-control px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer select-none",
				"text-foreground-muted hover:text-foreground hover:bg-surface-muted",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
				className,
			)}
			aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
			title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
		>
			{isDark ? (
				<Sun className="h-4 w-4 shrink-0 text-warning" />
			) : (
				<Moon className="h-4 w-4 shrink-0 text-foreground" />
			)}
			{showLabel && <span>{isDark ? "Modo claro" : "Modo oscuro"}</span>}
		</button>
	);
}
