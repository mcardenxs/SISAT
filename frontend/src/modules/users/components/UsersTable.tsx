import type { User } from "@/core/auth/types";
import { Badge } from "@/core/components/ui/Badge";
import { Button } from "@/core/components/ui/Button";
import { Spinner } from "@/core/components/ui/Spinner";
import {
	ChevronLeft,
	ChevronRight,
	AlertCircle,
	Shield,
	User as UserIcon,
} from "lucide-react";

interface UsersTableProps {
	users?: User[];
	isLoading: boolean;
	isError: boolean;
	error?: unknown;
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function UsersTable({
	users,
	isLoading,
	isError,
	error,
	currentPage,
	totalPages,
	onPageChange,
}: UsersTableProps) {
	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-16 space-y-3">
				<Spinner size="lg" className="text-indigo-500" />
				<p className="text-sm text-slate-400">Cargando lista de usuarios...</p>
			</div>
		);
	}

	if (isError) {
		const message =
			error instanceof Error
				? error.message
				: "No tienes permisos suficientes o el servidor no respondió.";

		return (
			<div className="flex items-center gap-3 rounded-xl border border-rose-900/40 bg-rose-950/20 p-4 text-rose-400">
				<AlertCircle className="h-5 w-5 shrink-0" />
				<div className="text-sm">
					<p className="font-semibold">Error al cargar usuarios</p>
					<p className="text-xs text-rose-300/80 mt-0.5">{message}</p>
				</div>
			</div>
		);
	}

	if (!users || users.length === 0) {
		return (
			<div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center">
				<UserIcon className="mx-auto h-10 w-10 text-slate-500" />
				<h4 className="mt-3 text-sm font-semibold text-slate-200">
					No se encontraron usuarios
				</h4>
				<p className="mt-1 text-xs text-slate-400">
					Intenta ajustar los filtros de búsqueda.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead className="border-b border-slate-800 bg-slate-900/90 text-xs uppercase tracking-wider text-slate-400">
							<tr>
								<th className="px-6 py-3.5">ID</th>
								<th className="px-6 py-3.5">Usuario</th>
								<th className="px-6 py-3.5">Correo</th>
								<th className="px-6 py-3.5">Rol</th>
								<th className="px-6 py-3.5">Estado</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-800/60">
							{users.map((user) => {
								const roleVariant =
									user.role === "ADMINISTRADOR"
										? "purple"
										: user.role === "JEFE_DE_AREA"
											? "info"
											: user.role === "RESPONSABLE_DE_SISTEMA"
												? "warning"
												: user.role === "DESARROLLADOR"
													? "success"
													: "default";

								return (
									<tr
										key={user.id}
										className="hover:bg-slate-800/30 transition-colors"
									>
										<td className="px-6 py-4 font-mono text-xs text-slate-400">
											#{user.id}
										</td>
										<td className="px-6 py-4 font-medium text-slate-200">
											<div className="flex items-center gap-2.5">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-indigo-400">
													{user.name.charAt(0).toUpperCase()}
												</div>
												<span>{user.name}</span>
											</div>
										</td>
										<td className="px-6 py-4 text-slate-300">{user.email}</td>
										<td className="px-6 py-4">
											<Badge variant={roleVariant} className="gap-1">
												<Shield className="h-3 w-3" />
												{user.role}
											</Badge>
										</td>
										<td className="px-6 py-4">
											<Badge variant={user.isActive ? "success" : "danger"}>
												{user.isActive ? "Activo" : "Inactivo"}
											</Badge>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>

			{/* Paginación */}
			<div className="flex items-center justify-between px-1">
				<p className="text-xs text-slate-400">
					Página{" "}
					<span className="font-semibold text-slate-200">{currentPage}</span> de{" "}
					<span className="font-semibold text-slate-200">
						{Math.max(1, totalPages)}
					</span>
				</p>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						disabled={currentPage <= 1}
						onClick={() => onPageChange(currentPage - 1)}
					>
						<ChevronLeft className="h-4 w-4" />
						Anterior
					</Button>
					<Button
						variant="outline"
						size="sm"
						disabled={currentPage >= totalPages}
						onClick={() => onPageChange(currentPage + 1)}
					>
						Siguiente
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
