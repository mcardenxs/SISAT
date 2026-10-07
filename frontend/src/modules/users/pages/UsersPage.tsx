import { useState } from "react";
import { useUsersQuery } from "../hooks/useUsersQuery";
import { UsersTable } from "../components/UsersTable";
import { Input } from "@/core/components/ui/Input";
import { Button } from "@/core/components/ui/Button";
import { PageHeader } from "@/core/components/ui/PageHeader";
import { Can } from "@/core/permissions/Can";
import { Search, Plus } from "lucide-react";
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
			{/* Encabezado según la guía ANDROMEDA */}
			<PageHeader
				title="Gestión de Usuarios"
				description="Consulta y administra los usuarios registrados en el sistema institucional."
				actions={
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
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
							<Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-foreground-subtle pointer-events-none" />
						</div>

						<Can resource="users" action="create">
							<Button
								onClick={() => setIsCreateOpen(true)}
								className="gap-1.5 shrink-0"
								size="sm"
							>
								<Plus className="h-4 w-4" />
								Crear Usuario
							</Button>
						</Can>
					</div>
				}
			/>

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
