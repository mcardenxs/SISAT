import { useState } from "react";
import type { User } from "@/core/auth/types";
import { Badge } from "@/core/components/ui/Badge";
import { Button } from "@/core/components/ui/Button";
import { Spinner } from "@/core/components/ui/Spinner";
import { Can } from "@/core/permissions/Can";
import {
	ChevronLeft,
	ChevronRight,
	AlertCircle,
	Shield,
	User as UserIcon,
	Edit,
	Trash2,
	KeyRound,
} from "lucide-react";
import { EditUserModal } from "./EditUserModal";
import { UserEffectivePermissionsModal } from "./UserEffectivePermissionsModal";
import { useUserMutations } from "../hooks/useUserMutations";

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
	const [selectedEditUser, setSelectedEditUser] = useState<User | null>(null);
	const [selectedPermsUser, setSelectedPermsUser] = useState<User | null>(null);

	const { deleteUserMutation } = useUserMutations();

	const handleDelete = async (u: User) => {
		if (
			window.confirm(
				`¿Estás seguro de eliminar al usuario ${u.name} (${u.email})? Esta acción no se puede deshacer.`,
			)
		) {
			await deleteUserMutation.mutateAsync(u.id);
		}
	};

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
			<div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 shadow-lg">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-xs">
						<thead className="border-b border-slate-800 bg-slate-900/90 uppercase tracking-wider text-slate-400">
							<tr>
								<th className="px-5 py-3.5">ID</th>
								<th className="px-5 py-3.5">Usuario</th>
								<th className="px-5 py-3.5">Correo</th>
								<th className="px-5 py-3.5">Rol</th>
								<th className="px-5 py-3.5">Estado</th>
								<th className="px-5 py-3.5 text-right">Acciones</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-800/60">
							{users.map((u) => {
								const roleVariant =
									u.role === "ADMINISTRADOR" || u.role === "ADMIN"
										? "purple"
										: u.role === "JEFE_DE_AREA"
											? "info"
											: u.role === "RESPONSABLE_DE_SISTEMA"
												? "warning"
												: u.role === "DESARROLLADOR"
													? "success"
													: "default";

								return (
									<tr
										key={u.id}
										className="hover:bg-slate-800/30 transition-colors"
									>
										<td className="px-5 py-3.5 font-mono text-xs text-slate-500">
											#{u.id}
										</td>
										<td className="px-5 py-3.5 font-medium text-slate-200">
											<div className="flex items-center gap-2.5">
												<div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-indigo-400">
													{u.name.charAt(0).toUpperCase()}
												</div>
												<span>
													{u.name} {u.apellido || ""}
												</span>
											</div>
										</td>
										<td className="px-5 py-3.5 text-slate-300 font-mono text-[11px]">
											{u.email}
										</td>
										<td className="px-5 py-3.5">
											<Badge
												variant={roleVariant}
												className="gap-1 text-[10px]"
											>
												<Shield className="h-3 w-3" />
												{u.role}
											</Badge>
										</td>
										<td className="px-5 py-3.5">
											<Badge
												variant={u.isActive ? "success" : "danger"}
												className="text-[10px]"
											>
												{u.isActive ? "Activo" : "Inactivo"}
											</Badge>
										</td>
										<td className="px-5 py-3.5 text-right">
											<div className="flex items-center justify-end gap-1">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => setSelectedPermsUser(u)}
													className="h-7 w-7 p-0 text-slate-400 hover:text-indigo-400 hover:bg-slate-800"
													title="Ver permisos efectivos"
												>
													<KeyRound className="h-3.5 w-3.5" />
												</Button>

												<Can resource="users" action="update">
													<Button
														variant="ghost"
														size="sm"
														onClick={() => setSelectedEditUser(u)}
														className="h-7 w-7 p-0 text-slate-400 hover:text-emerald-400 hover:bg-slate-800"
														title="Editar usuario"
													>
														<Edit className="h-3.5 w-3.5" />
													</Button>
												</Can>

												<Can resource="users" action="delete">
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleDelete(u)}
														disabled={deleteUserMutation.isPending}
														className="h-7 w-7 p-0 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20"
														title="Eliminar usuario"
													>
														<Trash2 className="h-3.5 w-3.5" />
													</Button>
												</Can>
											</div>
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

			{/* Modal Edición de Usuario */}
			{selectedEditUser && (
				<EditUserModal
					isOpen={Boolean(selectedEditUser)}
					onClose={() => setSelectedEditUser(null)}
					user={selectedEditUser}
				/>
			)}

			{/* Modal Permisos Efectivos */}
			{selectedPermsUser && (
				<UserEffectivePermissionsModal
					isOpen={Boolean(selectedPermsUser)}
					onClose={() => setSelectedPermsUser(null)}
					user={selectedPermsUser}
				/>
			)}
		</div>
	);
}
