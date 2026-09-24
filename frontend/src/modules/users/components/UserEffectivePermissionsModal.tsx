import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { Badge } from "@/core/components/ui/Badge";
import { useQuery } from "@tanstack/react-query";
import { permissionApi } from "@/core/permissions/permissionApi";
import type { User } from "@/core/auth/types";
import { KeyRound, Shield } from "lucide-react";

interface UserEffectivePermissionsModalProps {
	isOpen: boolean;
	onClose: () => void;
	user: User;
}

export function UserEffectivePermissionsModal({
	isOpen,
	onClose,
	user,
}: UserEffectivePermissionsModalProps) {
	const { data: permissions, isLoading } = useQuery({
		queryKey: ["userEffectivePermissions", user.id],
		queryFn: () => permissionApi.getUserPermissions(user.id),
		enabled: isOpen,
	});

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`Permisos Efectivos: ${user.name}`}
			className="max-w-xl"
		>
			<div className="space-y-4">
				<div className="flex items-center gap-3 rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3.5 text-xs text-indigo-300">
					<Shield className="h-5 w-5 shrink-0 text-indigo-400" />
					<div>
						<p className="font-semibold text-white">
							Matriz Resuelta de Autorización (RBAC)
						</p>
						<p className="text-slate-300 mt-0.5">
							Rol principal:{" "}
							<strong className="text-indigo-400">{user.role}</strong>. Estos
							son los privilegios efectivos calculados sobre recursos y
							acciones.
						</p>
					</div>
				</div>

				{isLoading ? (
					<div className="p-8 text-center text-xs text-slate-400">
						Calculando permisos efectivos...
					</div>
				) : !permissions || permissions.length === 0 ? (
					<div className="p-8 text-center text-xs text-slate-500 italic border border-dashed border-slate-800 rounded-lg">
						No se encontraron permisos explícitos asignados.
					</div>
				) : (
					<div className="max-h-72 overflow-y-auto divide-y divide-slate-800/80 rounded-lg border border-slate-800 bg-slate-950/40">
						{permissions.map((p) => (
							<div
								key={p.id}
								className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-slate-800/20 transition-colors"
							>
								<div className="flex items-center gap-2">
									<KeyRound className="h-3.5 w-3.5 text-indigo-400" />
									<span className="font-mono text-slate-200">{p.resource}</span>
								</div>
								<Badge
									variant="purple"
									className="text-[10px] uppercase font-mono"
								>
									{p.action}
								</Badge>
							</div>
						))}
					</div>
				)}

				<div className="flex items-center justify-end pt-2">
					<Button size="sm" variant="ghost" onClick={onClose}>
						Cerrar
					</Button>
				</div>
			</div>
		</Modal>
	);
}
