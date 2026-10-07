import { type ReactNode, useState, useEffect } from "react";
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
	FileText,
	Shield,
	Menu,
	X,
} from "lucide-react";
import { useAuthStore } from "@/core/auth/store";
import { Badge } from "@/core/components/ui/Badge";
import { Button } from "@/core/components/ui/Button";
import { ThemeToggle } from "@/core/components/ui/ThemeToggle";
import { Can } from "@/core/permissions/Can";
import { toast } from "sonner";
import { authApi } from "@/modules/auth/api/authApi";

interface MainLayoutProps {
	children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
	const navigate = useNavigate();
	const { user, refreshToken, logout } = useAuthStore();
	const [mobileOpen, setMobileOpen] = useState(false);

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

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && mobileOpen) {
				setMobileOpen(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [mobileOpen]);

	const roleVariant =
		user?.role === "ADMINISTRADOR" || user?.role === "ADMIN"
			? "info"
			: user?.role === "RESPONSABLE_DE_SISTEMA" || user?.role === "MOD"
				? "warning"
				: user?.role === "DESARROLLADOR"
					? "success"
					: "neutral";

	const navItems = (
		<nav className="space-y-1">
			<Link
				to="/dashboard"
				onClick={() => setMobileOpen(false)}
				className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-control text-foreground-muted hover:text-foreground hover:bg-surface-muted transition-colors [&.active]:bg-primary-light [&.active]:text-primary [&.active]:font-semibold [&.active]:border [&.active]:border-primary-border"
			>
				<LayoutDashboard className="h-4 w-4 shrink-0" />
				<span>Dashboard</span>
			</Link>

			<Can resource="tickets" action="read">
				<Link
					to="/tickets"
					onClick={() => setMobileOpen(false)}
					className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-control text-foreground-muted hover:text-foreground hover:bg-surface-muted transition-colors [&.active]:bg-primary-light [&.active]:text-primary [&.active]:font-semibold [&.active]:border [&.active]:border-primary-border"
				>
					<Ticket className="h-4 w-4 shrink-0" />
					<span>Tickets</span>
				</Link>
			</Can>

			<Can resource="actas" action="read">
				<Link
					to="/actas"
					onClick={() => setMobileOpen(false)}
					className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-control text-foreground-muted hover:text-foreground hover:bg-surface-muted transition-colors [&.active]:bg-primary-light [&.active]:text-primary [&.active]:font-semibold [&.active]:border [&.active]:border-primary-border"
				>
					<FileText className="h-4 w-4 shrink-0" />
					<span>Actas</span>
				</Link>
			</Can>

			<Can resource="sistemas" action="read">
				<Link
					to="/sistemas"
					onClick={() => setMobileOpen(false)}
					className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-control text-foreground-muted hover:text-foreground hover:bg-surface-muted transition-colors [&.active]:bg-primary-light [&.active]:text-primary [&.active]:font-semibold [&.active]:border [&.active]:border-primary-border"
				>
					<Monitor className="h-4 w-4 shrink-0" />
					<span>Sistemas</span>
				</Link>
			</Can>

			<Can resource="areas" action="read">
				<Link
					to="/areas"
					onClick={() => setMobileOpen(false)}
					className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-control text-foreground-muted hover:text-foreground hover:bg-surface-muted transition-colors [&.active]:bg-primary-light [&.active]:text-primary [&.active]:font-semibold [&.active]:border [&.active]:border-primary-border"
				>
					<Building2 className="h-4 w-4 shrink-0" />
					<span>Áreas</span>
				</Link>
			</Can>

			<Can resource="users" action="read">
				<Link
					to="/users"
					onClick={() => setMobileOpen(false)}
					className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-control text-foreground-muted hover:text-foreground hover:bg-surface-muted transition-colors [&.active]:bg-primary-light [&.active]:text-primary [&.active]:font-semibold [&.active]:border [&.active]:border-primary-border"
				>
					<Users className="h-4 w-4 shrink-0" />
					<span>Usuarios</span>
				</Link>
			</Can>

			<Can resource="permissions" action="read">
				<Link
					to="/permissions"
					onClick={() => setMobileOpen(false)}
					className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-control text-foreground-muted hover:text-foreground hover:bg-surface-muted transition-colors [&.active]:bg-primary-light [&.active]:text-primary [&.active]:font-semibold [&.active]:border [&.active]:border-primary-border"
				>
					<Shield className="h-4 w-4 shrink-0" />
					<span>Permisos</span>
				</Link>
			</Can>

			<Link
				to="/profile"
				onClick={() => setMobileOpen(false)}
				className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-control text-foreground-muted hover:text-foreground hover:bg-surface-muted transition-colors [&.active]:bg-primary-light [&.active]:text-primary [&.active]:font-semibold [&.active]:border [&.active]:border-primary-border"
			>
				<UserCheck className="h-4 w-4 shrink-0" />
				<span>Mi Perfil</span>
			</Link>
		</nav>
	);

	const sidebarFooter = (
		<div className="pt-3 border-t border-subtle space-y-3">
			<div className="flex items-center justify-between px-1">
				<span className="text-xs font-medium text-foreground-muted">Tema</span>
				<ThemeToggle showLabel />
			</div>

			{user && (
				<div className="p-2.5 rounded-surface bg-surface-subtle border border-subtle space-y-2">
					<div className="min-w-0">
						<p className="text-xs font-semibold text-foreground truncate">
							{user.name}
						</p>
						<p className="text-[11px] text-foreground-muted truncate">
							{user.email}
						</p>
					</div>
					<Badge variant={roleVariant}>{user.role}</Badge>
				</div>
			)}

			<Button
				variant="ghost"
				size="sm"
				onClick={handleLogout}
				className="w-full justify-start text-foreground-muted hover:text-danger hover:bg-danger-subtle"
				title="Cerrar sesión"
			>
				<LogOut className="h-4 w-4 mr-2" />
				<span>Cerrar sesión</span>
			</Button>
		</div>
	);

	return (
		<div className="min-h-screen flex bg-canvas text-foreground">
			{/* Sidebar de Escritorio */}
			<aside className="hidden md:flex md:w-64 md:flex-col md:shrink-0 sticky top-0 h-screen bg-surface border-r border-subtle">
				<div className="flex h-16 items-center px-6 border-b border-subtle gap-3">
					<Link to="/dashboard" className="flex items-center gap-2.5 group">
						<div className="flex h-8 w-8 items-center justify-center rounded-control bg-primary-light border border-primary-border text-primary group-hover:bg-primary group-hover:text-white transition-colors">
							<Hexagon className="h-5 w-5 stroke-[2]" />
						</div>
						<div>
							<span className="text-base font-bold tracking-tight text-foreground block leading-tight">
								SISAT
							</span>
							<span className="text-[10px] text-foreground-subtle block leading-tight">
								Atención Técnica
							</span>
						</div>
					</Link>
				</div>

				<div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
					<div className="px-3">
						<p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle">
							Opciones
						</p>
					</div>
					{navItems}
				</div>

				<div className="p-3">{sidebarFooter}</div>
			</aside>

			{/* Barra móvil */}
			<div className="md:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-surface border-b border-subtle px-4 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => setMobileOpen(true)}
						className="p-1.5 rounded-control text-foreground-muted hover:text-foreground hover:bg-surface-muted transition-colors cursor-pointer"
						aria-label="Abrir menú de opciones"
					>
						<Menu className="h-5 w-5" />
					</button>
					<Link to="/dashboard" className="flex items-center gap-2">
						<div className="flex h-7 w-7 items-center justify-center rounded-control bg-primary-light text-primary">
							<Hexagon className="h-4 w-4 stroke-[2]" />
						</div>
						<span className="text-sm font-bold tracking-tight text-foreground">
							SISAT
						</span>
					</Link>
				</div>

				<div className="flex items-center gap-2">
					<ThemeToggle />
				</div>
			</div>

			{/* Modal Drawer Móvil */}
			{mobileOpen && (
				<div className="md:hidden fixed inset-0 z-50 flex">
					<div
						className="fixed inset-0 bg-black/60 backdrop-fade"
						onClick={() => setMobileOpen(false)}
						aria-hidden="true"
					/>
					<aside className="relative flex flex-col w-72 max-w-[80vw] bg-surface h-full shadow-overlay p-4 z-10 border-r border-subtle animate-in slide-in-from-left duration-200">
						<div className="flex items-center justify-between pb-3 border-b border-subtle">
							<div className="flex items-center gap-2">
								<div className="flex h-8 w-8 items-center justify-center rounded-control bg-primary-light text-primary">
									<Hexagon className="h-5 w-5 stroke-[2]" />
								</div>
								<span className="text-base font-bold text-foreground">
									SISAT
								</span>
							</div>
							<button
								type="button"
								onClick={() => setMobileOpen(false)}
								className="p-1.5 rounded-control text-foreground-muted hover:text-foreground hover:bg-surface-muted transition-colors"
								aria-label="Cerrar menú"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<div className="flex-1 overflow-y-auto py-4 space-y-4">
							<div className="px-3">
								<p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle">
									Opciones
								</p>
							</div>
							{navItems}
						</div>

						{sidebarFooter}
					</aside>
				</div>
			)}

			{/* Área de contenido principal */}
			<div className="flex-1 min-w-0 flex flex-col min-h-screen pt-14 md:pt-0">
				<main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{children}
				</main>

				<footer className="border-t border-subtle py-4 px-4 text-center text-xs text-foreground-subtle">
					SISAT &copy; {new Date().getFullYear()} &mdash; Sistema de Atención
					Técnica
				</footer>
			</div>
		</div>
	);
}
