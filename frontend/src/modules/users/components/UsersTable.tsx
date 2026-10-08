import { useState } from "react";
import type { User } from "@/core/auth/types";
import { Badge } from "@/core/components/ui/Badge";
import { Button } from "@/core/components/ui/Button";
import { Spinner } from "@/core/components/ui/Spinner";
import { Alert } from "@/core/components/ui/Alert";
import { EmptyState } from "@/core/components/ui/EmptyState";
import { Can } from "@/core/permissions/Can";
import {
	ChevronLeft,
	ChevronRight,
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
				<Spinner size="lg" className="text-primary" />
				<p className="text-sm text-foreground-muted">
					Cargando lista de usuarios...
				</p>
			</div>
		);
	}

	if (isError) {
		const message =
			error instanceof Error
				? error.message
				: "No tienes permisos suficientes o el servidor no respondió.";

		return (
			<Alert variant="danger" title="Error al cargar usuarios">
				{message}
			</Alert>
		);
	}

	if (!users || users.length === 0) {
		return (
			<EmptyState
				icon={<UserIcon className="h-10 w-10" />}
				title="No se encontraron usuarios"
				description="Intenta ajustar los filtros de búsqueda o registra un nuevo usuario."
			/>
		);
	}

	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-surface border border-subtle bg-surface shadow-surface">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-xs">
						<thead className="border-b border-subtle bg-surface-subtle uppercase tracking-wider text-foreground-muted">
							<tr>
								<th className="px-5 py-3.5">ID</th>
								<th className="px-5 py-3.5">Usuario</th>
								<th className="px-5 py-3.5">Correo</th>
								<th className="px-5 py-3.5">Rol</th>
								<th className="px-5 py-3.5">Estado</th>
								<th className="px-5 py-3.5 text-right">Acciones</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-subtle">
							{users.map((u) => {
								const roleVariant =
									u.role === "ADMINISTRADOR" || u.role === "ADMIN"
										? "info"
										: u.role === "JEFE_DE_AREA"
											? "info"
											: u.role === "RESPONSABLE_DE_SISTEMA"
												? "warning"
												: u.role === "DESARROLLADOR"
													? "success"
													: "neutral";

								return (
									<tr
										key={u.id}
										className="hover:bg-surface-muted/50 transition-colors"
									>
										<td className="px-5 py-3.5 font-mono text-xs text-foreground-subtle">
											#{u.id}
										</td>
										<td className="px-5 py-3.5 font-medium text-foreground">
											<div className="flex items-center gap-2.5">
												<div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-muted text-xs font-semibold text-primary">
													{u.name.charAt(0).toUpperCase()}
												</div>
												<span>
													{u.name} {u.apellido || ""}
												</span>
											</div>
										</td>
										<td className="px-5 py-3.5 text-foreground-muted font-mono text-[11px]">
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
													className="h-7 w-7 p-0 text-foreground-muted hover:text-primary hover:bg-surface-muted"
													title="Ver permisos efectivos"
												>
													<KeyRound className="h-3.5 w-3.5" />
												</Button>

												<Can resource="users" action="update">
													<Button
														variant="ghost"
														size="sm"
														onClick={() => setSelectedEditUser(u)}
														className="h-7 w-7 p-0 text-foreground-muted hover:text-success hover:bg-surface-muted"
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
														className="h-7 w-7 p-0 text-foreground-muted hover:text-danger hover:bg-danger-subtle"
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
				<p className="text-xs text-foreground-muted">
					Página{" "}
					<span className="font-semibold text-foreground">{currentPage}</span>{" "}
					de{" "}
					<span className="font-semibold text-foreground">
						{Math.max(1, totalPages)}
					</span>
				</p>
				<div className="flex items-center gap-2">
					<Button
						variant="secondary"
						size="sm"
						disabled={currentPage <= 1}
						onClick={() => onPageChange(currentPage - 1)}
					>
						<ChevronLeft className="h-4 w-4" />
						Anterior
					</Button>
					<Button
						variant="secondary"
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
