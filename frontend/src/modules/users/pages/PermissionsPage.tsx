import { useQuery } from "@tanstack/react-query";
import { permissionApi } from "@/core/permissions/permissionApi";
import { Badge } from "@/core/components/ui/Badge";
import { PageHeader } from "@/core/components/ui/PageHeader";
import { Check, Minus, KeyRound, Lock } from "lucide-react";

interface RoleDef {
	codigo: string;
	nombre: string;
	badge: "info" | "warning" | "success" | "neutral";
	description: string;
	permissions: Array<{ resource: string; action: string }>;
}

const ROLES_CATALOG: RoleDef[] = [
	{
		codigo: "ADMINISTRADOR",
		nombre: "Administrador General",
		badge: "info",
		description:
			"Control y acceso total e irrestricto sobre todos los recursos y acciones (* : *).",
		permissions: [{ resource: "*", action: "*" }],
	},
	{
		codigo: "RESPONSABLE_DE_SISTEMA",
		nombre: "Responsable de Sistema",
		badge: "warning",
		description:
			"Asignación de desarrolladores, validación de diagnósticos, evaluación y cierre formal.",
		permissions: [
			{ resource: "users", action: "read" },
			{ resource: "areas", action: "read" },
			{ resource: "sistemas", action: "read" },
			{ resource: "tickets", action: "read" },
			{ resource: "tickets", action: "create" },
			{ resource: "tickets", action: "update" },
			{ resource: "actas", action: "read" },
			{ resource: "asignaciones", action: "create" },
			{ resource: "reasignaciones", action: "create" },
			{ resource: "cierre", action: "create" },
			{ resource: "reapertura", action: "create" },
			{ resource: "evaluacion", action: "create" },
		],
	},
	{
		codigo: "DESARROLLADOR",
		nombre: "Desarrollador de Software",
		badge: "success",
		description:
			"Atención técnica de incidencias, bitácora de intervenciones y entrega de soluciones.",
		permissions: [
			{ resource: "users", action: "read" },
			{ resource: "areas", action: "read" },
			{ resource: "sistemas", action: "read" },
			{ resource: "tickets", action: "read" },
			{ resource: "actas", action: "read" },
			{ resource: "atencion", action: "create" },
			{ resource: "atencion", action: "update" },
			{ resource: "intervenciones", action: "create" },
			{ resource: "evidencias", action: "create" },
			{ resource: "resolucion", action: "create" },
		],
	},
	{
		codigo: "JEFE_DE_AREA",
		nombre: "Jefe de Área Solicitante",
		badge: "info",
		description:
			"Levantamiento de tickets, consulta de avances y firma de actas semanales de entrega.",
		permissions: [
			{ resource: "users", action: "read" },
			{ resource: "areas", action: "read" },
			{ resource: "sistemas", action: "read" },
			{ resource: "tickets", action: "read" },
			{ resource: "tickets", action: "create" },
			{ resource: "actas", action: "read" },
			{ resource: "actas", action: "create" },
			{ resource: "actas", action: "firmar" },
		],
	},
	{
		codigo: "CONSULTA",
		nombre: "Usuario de Consulta",
		badge: "neutral",
		description:
			"Acceso de solo lectura y seguimiento informativo sin privilegios de mutación.",
		permissions: [
			{ resource: "users", action: "read" },
			{ resource: "areas", action: "read" },
			{ resource: "sistemas", action: "read" },
			{ resource: "tickets", action: "read" },
			{ resource: "actas", action: "read" },
			{ resource: "dashboard", action: "read" },
		],
	},
];

const SYSTEM_RESOURCES = [
	{ key: "tickets", label: "Tickets de Soporte" },
	{ key: "sistemas", label: "Sistemas Institucionales" },
	{ key: "actas", label: "Actas de Entrega-Recepción" },
	{ key: "areas", label: "Áreas Organizacionales" },
	{ key: "users", label: "Usuarios y Cuentas" },
	{ key: "permissions", label: "Permisos y RBAC" },
];

const SYSTEM_ACTIONS = ["create", "read", "update", "delete", "firmar"];

export function PermissionsPage() {
	const { data: dbPermissions } = useQuery({
		queryKey: ["permissionsAll"],
		queryFn: permissionApi.getAll,
	});

	const hasPermission = (
		role: RoleDef,
		resource: string,
		action: string,
	): boolean => {
		if (role.codigo === "ADMINISTRADOR") return true;
		return role.permissions.some((p) => {
			const resMatch = p.resource === "*" || p.resource === resource;
			const actMatch = p.action === "*" || p.action === action;
			return resMatch && actMatch;
		});
	};

	return (
		<div className="space-y-6">
			{/* Encabezado según la guía ANDROMEDA */}
			<PageHeader
				title="Matriz de Roles y Permisos (RBAC)"
				description="Configuración centralizada de control de acceso basada en roles y acciones sobre recursos."
			/>

			{/* Roles del Sistema */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{ROLES_CATALOG.map((role) => (
					<div
						key={role.codigo}
						className="p-5 rounded-surface border border-subtle bg-surface shadow-surface space-y-2.5"
					>
						<div className="flex items-center justify-between">
							<span className="font-semibold text-sm text-foreground">
								{role.nombre}
							</span>
							<Badge variant={role.badge} className="text-[10px]">
								{role.codigo}
							</Badge>
						</div>
						<p className="text-xs text-foreground-muted leading-relaxed">
							{role.description}
						</p>
						<div className="pt-2 text-[11px] text-primary flex items-center gap-1 font-mono font-medium">
							<KeyRound className="h-3 w-3" />
							{role.permissions.length} privilegio(s) de regla
						</div>
					</div>
				))}
			</div>

			{/* Matriz Visual de Permisos por Rol y Recurso */}
			<div className="rounded-surface border border-subtle bg-surface overflow-hidden shadow-surface">
				<div className="p-5 border-b border-subtle bg-surface-subtle">
					<h3 className="text-base font-semibold text-foreground flex items-center gap-2">
						<Lock className="h-4 w-4 text-primary" />
						Matriz de Permisos Heredados por Rol
					</h3>
					<p className="text-xs text-foreground-muted mt-1">
						Cruza los recursos del sistema frente a las 5 operaciones
						fundamentales.
					</p>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left text-xs">
						<thead className="border-b border-subtle bg-surface-subtle uppercase tracking-wider text-foreground-muted">
							<tr>
								<th className="px-5 py-3.5 font-semibold">Recurso</th>
								<th className="px-5 py-3.5 font-semibold">Acción</th>
								{ROLES_CATALOG.map((r) => (
									<th
										key={r.codigo}
										className="px-4 py-3.5 text-center font-semibold"
									>
										{r.codigo.replace("_", " ")}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-subtle">
							{SYSTEM_RESOURCES.flatMap((res) =>
								SYSTEM_ACTIONS.map((action, actionIdx) => (
									<tr
										key={`${res.key}-${action}`}
										className="hover:bg-surface-muted/50 transition-colors"
									>
										{actionIdx === 0 && (
											<td
												rowSpan={SYSTEM_ACTIONS.length}
												className="px-5 py-3 font-semibold text-foreground border-r border-subtle bg-surface-subtle/30 align-top"
											>
												{res.label}
												<span className="block font-mono text-[10px] text-foreground-subtle font-normal">
													{res.key}
												</span>
											</td>
										)}
										<td className="px-5 py-3 font-mono text-primary font-medium">
											{action}
										</td>

										{ROLES_CATALOG.map((role) => {
											const allowed = hasPermission(role, res.key, action);
											return (
												<td key={role.codigo} className="px-4 py-3 text-center">
													{allowed ? (
														<span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-success-subtle text-success border border-success-border">
															<Check className="h-3 w-3 stroke-[2.5]" />
														</span>
													) : (
														<span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-foreground-subtle">
															<Minus className="h-3 w-3" />
														</span>
													)}
												</td>
											);
										})}
									</tr>
								)),
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Catálogo de Permisos Dinámicos Registrados */}
			{dbPermissions && dbPermissions.length > 0 && (
				<div className="rounded-surface border border-subtle bg-surface p-5 shadow-surface">
					<h3 className="text-sm font-semibold text-foreground mb-3">
						Permisos de Base de Datos ({dbPermissions.length})
					</h3>
					<div className="flex flex-wrap gap-2">
						{dbPermissions.map((dp) => (
							<span
								key={dp.id}
								className="px-2.5 py-1 rounded-control bg-surface-subtle border border-subtle font-mono text-[11px] text-foreground"
							>
								{dp.resource}:{dp.action}
							</span>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
