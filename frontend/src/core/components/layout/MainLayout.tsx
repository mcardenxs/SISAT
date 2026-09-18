import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
	Hexagon,
	LayoutDashboard,
	Users,
	UserCheck,
	LogOut,
	Monitor,
	Building2,
	Ticket,
} from "lucide-react";
import { useAuthStore } from "@/core/auth/store";
import { Badge } from "@/core/components/ui/Badge";
import { Button } from "@/core/components/ui/Button";
import { toast } from "sonner";
import { authApi } from "@/modules/auth/api/authApi";

interface MainLayoutProps {
	children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
	const navigate = useNavigate();
	const { user, refreshToken, logout } = useAuthStore();

	const handleLogout = async () => {
		try {
			if (refreshToken) {
				await authApi.logout(refreshToken);
			}
		} catch {
			// Ignoramos error en logout para asegurar limpieza local
		} finally {
			logout();
			toast.info("Sesión cerrada correctamente");
			navigate({ to: "/login" });
		}
	};

	const roleVariant =
		user?.role === "ADMINISTRADOR" || user?.role === "ADMIN"
			? "purple"
			: user?.role === "RESPONSABLE_DE_SISTEMA" || user?.role === "MOD"
				? "warning"
				: user?.role === "DESARROLLADOR"
					? "info"
					: "default";

	return (
		<div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
			{/* Navbar Superior */}
			<header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between gap-4">
						<div className="flex items-center gap-8">
							<Link to="/dashboard" className="flex items-center gap-2.5 group">
								<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-600/20 transition-colors">
									<Hexagon className="h-5 w-5 stroke-[2.2]" />
								</div>
								<span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
									SISAT
								</span>
							</Link>

							<nav className="hidden md:flex items-center gap-1">
								<Link
									to="/dashboard"
									className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors [&.active]:bg-indigo-600/10 [&.active]:text-indigo-400 [&.active]:border [&.active]:border-indigo-500/20"
								>
									<LayoutDashboard className="h-4 w-4" />
									Dashboard
								</Link>
								<Link
									to="/tickets"
									className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors [&.active]:bg-indigo-600/10 [&.active]:text-indigo-400 [&.active]:border [&.active]:border-indigo-500/20"
								>
									<Ticket className="h-4 w-4" />
									Tickets
								</Link>
								<Link
									to="/sistemas"
									className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors [&.active]:bg-indigo-600/10 [&.active]:text-indigo-400 [&.active]:border [&.active]:border-indigo-500/20"
								>
									<Monitor className="h-4 w-4" />
									Sistemas
								</Link>
								<Link
									to="/areas"
									className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors [&.active]:bg-indigo-600/10 [&.active]:text-indigo-400 [&.active]:border [&.active]:border-indigo-500/20"
								>
									<Building2 className="h-4 w-4" />
									Áreas
								</Link>
								<Link
									to="/users"
									className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors [&.active]:bg-indigo-600/10 [&.active]:text-indigo-400 [&.active]:border [&.active]:border-indigo-500/20"
								>
									<Users className="h-4 w-4" />
									Usuarios
								</Link>
								<Link
									to="/profile"
									className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors [&.active]:bg-indigo-600/10 [&.active]:text-indigo-400 [&.active]:border [&.active]:border-indigo-500/20"
								>
									<UserCheck className="h-4 w-4" />
									Mi Perfil
								</Link>
							</nav>
						</div>

						<div className="flex items-center gap-3">
							{user && (
								<div className="hidden sm:flex items-center gap-2.5 pr-2">
									<div className="text-right">
										<p className="text-xs font-semibold text-slate-200">
											{user.name}
										</p>
										<p className="text-[11px] text-slate-400">{user.email}</p>
									</div>
									<Badge variant={roleVariant}>{user.role}</Badge>
								</div>
							)}

							<Button
								variant="ghost"
								size="sm"
								onClick={handleLogout}
								className="text-slate-400 hover:text-rose-400 hover:bg-rose-950/20"
								title="Cerrar sesión"
							>
								<LogOut className="h-4 w-4 mr-1.5" />
								<span className="hidden sm:inline">Salir</span>
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Contenido Principal */}
			<main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
				{children}
			</main>

			{/* Footer */}
			<footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
				Hexacore Monorepo &copy; {new Date().getFullYear()} &mdash; Arquitectura
				Hexagonal y Modular
			</footer>
		</div>
	);
}
