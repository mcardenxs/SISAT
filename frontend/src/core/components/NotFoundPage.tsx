import { useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
	Hexagon,
	ArrowLeft,
	LayoutDashboard,
	LogIn,
	Ticket,
	Monitor,
	FileText,
	Copy,
	Check,
	Compass,
	BookOpen,
} from "lucide-react";
import { useAuthStore } from "@/core/auth/store";
import { Button } from "@/core/components/ui/Button";
import { toast } from "sonner";

export function NotFoundPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const { isAuthenticated } = useAuthStore();
	const [copied, setCopied] = useState(false);

	const currentPath = location.pathname || "/";

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			toast.success("Enlace copiado al portapapeles");
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error("No se pudo copiar el enlace");
		}
	};

	const handleGoBack = () => {
		if (window.history.length > 1) {
			window.history.back();
		} else {
			navigate({ to: isAuthenticated ? "/dashboard" : "/login" });
		}
	};

	return (
		<div className="relative min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 overflow-hidden select-none">
			{/* Efectos de fondo luminosos (Glow ambiental) */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
				<div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
				<div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-cyan-600/10 blur-3xl" />
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:32px_32px]" />
			</div>

			{/* Header superior */}
			<header className="relative z-10 w-full border-b border-slate-900 bg-slate-950/60 backdrop-blur-md">
				<div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
					<Link
						to={isAuthenticated ? "/dashboard" : "/login"}
						className="flex items-center gap-2.5 group"
					>
						<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 group-hover:bg-blue-600/20 group-hover:border-blue-500/40 transition-colors">
							<Hexagon className="h-5 w-5 stroke-[2.2]" />
						</div>
						<div className="flex flex-col">
							<span className="text-base font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
								SISAT
							</span>
							<span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
								Atención Técnica
							</span>
						</div>
					</Link>

					<div className="flex items-center gap-2">
						<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
							<span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
							HTTP 404
						</span>
					</div>
				</div>
			</header>

			{/* Contenedor central */}
			<main className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16 text-center my-auto">
				{/* Insignia y Gráfico Central */}
				<div className="relative inline-flex items-center justify-center mb-6">
					<div className="absolute h-32 w-32 rounded-full bg-blue-500/10 blur-xl animate-pulse" />
					<div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-blue-500/10">
						<Compass className="h-12 w-12 text-blue-400 stroke-[1.6] animate-[spin_20s_linear_infinite]" />
						<div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600/20 border border-rose-500/30 text-rose-400 text-xs font-bold font-mono">
							!
						</div>
					</div>
				</div>

				{/* 404 Gigante con Tipografía Moderna */}
				<div className="space-y-3">
					<h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
						404
					</h1>
					<h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
						Página no encontrada
					</h2>
					<p className="max-w-md mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
						El recurso o la ruta a la que intentas acceder no existe en el
						sistema, ha sido reubicado o no dispones de los permisos requeridos.
					</p>
				</div>

				{/* Monospace Path Bar con botón de copiar */}
				<div className="mt-6 inline-flex max-w-full items-center gap-2 rounded-xl bg-slate-900/80 border border-slate-800/80 px-3.5 py-2 text-xs text-slate-300 shadow-inner">
					<span className="text-slate-500 font-mono">Ruta:</span>
					<code className="font-mono text-blue-400 truncate max-w-[240px] sm:max-w-xs">
						{currentPath}
					</code>
					<button
						type="button"
						onClick={handleCopy}
						title="Copiar URL completa"
						className="ml-1 inline-flex items-center gap-1 rounded-md bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
					>
						{copied ? (
							<>
								<Check className="h-3 w-3 text-emerald-400" />
								<span className="text-emerald-400">Copiado</span>
							</>
						) : (
							<>
								<Copy className="h-3 w-3" />
								<span>Copiar</span>
							</>
						)}
					</button>
				</div>

				{/* Botones de Acción Primarios */}
				<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
					<Button
						variant="outline"
						size="md"
						onClick={handleGoBack}
						className="gap-2 border-slate-700 bg-slate-900/80 hover:bg-slate-800"
					>
						<ArrowLeft className="h-4 w-4" />
						Regresar
					</Button>

					{isAuthenticated ? (
						<Link to="/dashboard">
							<Button
								variant="primary"
								size="md"
								className="gap-2 shadow-lg shadow-blue-600/25"
							>
								<LayoutDashboard className="h-4 w-4" />
								Ir al Dashboard
							</Button>
						</Link>
					) : (
						<Link to="/login">
							<Button
								variant="primary"
								size="md"
								className="gap-2 shadow-lg shadow-blue-600/25"
							>
								<LogIn className="h-4 w-4" />
								Iniciar Sesión
							</Button>
						</Link>
					)}
				</div>

				{/* Accesos Rápidos Sugeridos (Solo si está autenticado o accesos públicos) */}
				<div className="mt-12 pt-8 border-t border-slate-900">
					<p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
						{isAuthenticated
							? "Enlaces rápidos del sistema"
							: "Enlaces útiles de acceso"}
					</p>

					<div
						className={`grid grid-cols-1 ${
							isAuthenticated ? "sm:grid-cols-3" : "sm:grid-cols-2"
						} gap-3 text-left`}
					>
						{isAuthenticated ? (
							<>
								<Link
									to="/tickets"
									className="group p-3.5 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-blue-500/40 transition-all duration-150"
								>
									<div className="flex items-center gap-2.5 text-slate-200 group-hover:text-blue-400">
										<Ticket className="h-4 w-4 text-blue-400" />
										<span className="text-sm font-semibold">Tickets</span>
									</div>
									<p className="text-xs text-slate-500 mt-1 line-clamp-1">
										Gestión y atención técnica
									</p>
								</Link>

								<Link
									to="/sistemas"
									className="group p-3.5 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-blue-500/40 transition-all duration-150"
								>
									<div className="flex items-center gap-2.5 text-slate-200 group-hover:text-blue-400">
										<Monitor className="h-4 w-4 text-blue-400" />
										<span className="text-sm font-semibold">Sistemas</span>
									</div>
									<p className="text-xs text-slate-500 mt-1 line-clamp-1">
										Catálogo de aplicaciones
									</p>
								</Link>

								<Link
									to="/actas"
									className="group p-3.5 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-blue-500/40 transition-all duration-150"
								>
									<div className="flex items-center gap-2.5 text-slate-200 group-hover:text-blue-400">
										<FileText className="h-4 w-4 text-blue-400" />
										<span className="text-sm font-semibold">Actas</span>
									</div>
									<p className="text-xs text-slate-500 mt-1 line-clamp-1">
										Entregas semanales
									</p>
								</Link>
							</>
						) : (
							<>
								<Link
									to="/login"
									className="group p-3.5 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-blue-500/40 transition-all duration-150"
								>
									<div className="flex items-center gap-2.5 text-slate-200 group-hover:text-blue-400">
										<LogIn className="h-4 w-4 text-blue-400" />
										<span className="text-sm font-semibold">Acceso Seguro</span>
									</div>
									<p className="text-xs text-slate-500 mt-1 line-clamp-1">
										Iniciar sesión en SISAT
									</p>
								</Link>

								<a
									href="/docs"
									target="_blank"
									rel="noreferrer"
									className="group p-3.5 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-blue-500/40 transition-all duration-150"
								>
									<div className="flex items-center gap-2.5 text-slate-200 group-hover:text-blue-400">
										<BookOpen className="h-4 w-4 text-blue-400" />
										<span className="text-sm font-semibold">API Docs</span>
									</div>
									<p className="text-xs text-slate-500 mt-1 line-clamp-1">
										Scalar API Documentation
									</p>
								</a>
							</>
						)}
					</div>
				</div>
			</main>

			{/* Footer inferior */}
			<footer className="relative z-10 w-full border-t border-slate-900 py-4 text-center text-xs text-slate-600">
				SISAT • Sistema Integral de Soporte y Atención Técnica
			</footer>
		</div>
	);
}
