import { useState } from "react";
import { useUsersQuery } from "../hooks/useUsersQuery";
import { UsersTable } from "../components/UsersTable";
import { Input } from "@/core/components/ui/Input";
import { Button } from "@/core/components/ui/Button";
import { Can } from "@/core/permissions/Can";
import { Search, Users as UsersIcon, Plus } from "lucide-react";
import { CreateUserModal } from "../components/CreateUserModal";

export function UsersPage() {
	const [page, setPage] = useState(1);
	const [searchEmail, setSearchEmail] = useState("");
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	const { data, isLoading, isError, error } = useUsersQuery({
		page,
		limit: 10,
		email: searchEmail.trim() ? searchEmail.trim() : undefined,
	});

	return (
		<div className="space-y-6">
			{/* Encabezado */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<div className="flex items-center gap-2.5">
						<div className="p-2 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400">
							<UsersIcon className="h-5 w-5" />
						</div>
						<h1 className="text-2xl font-bold tracking-tight text-white">
							Gestión de Usuarios
						</h1>
					</div>
					<p className="mt-1 text-sm text-slate-400">
						Consulta y administra los usuarios registrados en el sistema
						institucional.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<div className="relative w-full sm:w-64">
						<Input
							type="text"
							placeholder="Buscar por email..."
							value={searchEmail}
							onChange={(e) => {
								setSearchEmail(e.target.value);
								setPage(1);
							}}
							className="pl-9 text-xs"
						/>
						<Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
					</div>

					<Can resource="users" action="create">
						<Button
							onClick={() => setIsCreateOpen(true)}
							className="gap-1.5 shrink-0"
						>
							<Plus className="h-4 w-4" />
							Crear Usuario
						</Button>
					</Can>
				</div>
			</div>

			<CreateUserModal
				isOpen={isCreateOpen}
				onClose={() => setIsCreateOpen(false)}
			/>

			{/* Tabla de Usuarios */}
			<UsersTable
				users={data?.data}
				isLoading={isLoading}
				isError={isError}
				error={error}
				currentPage={page}
				totalPages={data?.totalPages ?? 1}
				onPageChange={setPage}
			/>
		</div>
	);
}
