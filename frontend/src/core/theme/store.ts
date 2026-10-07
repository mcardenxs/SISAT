import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark";

interface ThemeState {
	theme: ThemeMode;
	setTheme: (theme: ThemeMode) => void;
	toggleTheme: () => void;
}

function applyThemeToDocument(theme: ThemeMode) {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	if (theme === "dark") {
		root.classList.add("dark");
		root.classList.remove("light");
		root.style.colorScheme = "dark";
	} else {
		root.classList.add("light");
		root.classList.remove("dark");
		root.style.colorScheme = "light";
	}
}

export const useThemeStore = create<ThemeState>()(
	persist(
		(set, get) => ({
			theme: "dark",
			setTheme: (theme: ThemeMode) => {
				applyThemeToDocument(theme);
				set({ theme });
			},
			toggleTheme: () => {
				const nextTheme: ThemeMode = get().theme === "dark" ? "light" : "dark";
				applyThemeToDocument(nextTheme);
				set({ theme: nextTheme });
			},
		}),
		{
			name: "sisat-theme-storage",
			onRehydrateStorage: () => (state) => {
				if (state?.theme) {
					applyThemeToDocument(state.theme);
				}
			},
		},
	),
);
