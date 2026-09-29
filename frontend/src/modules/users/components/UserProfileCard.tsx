import { useAuthStore } from "@/core/auth/store";
import { Badge } from "@/core/components/ui/Badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/core/components/ui/Card";
import { Shield, Mail, Hash, CheckCircle } from "lucide-react";

export function UserProfileCard() {
	const user = useAuthStore((state) => state.user);

	if (!user) {
		return (
			<Card>
				<p className="text-sm text-slate-400">
					No hay información de sesión activa.
				</p>
			</Card>
		);
	}

	const roleVariant =
		user.role === "ADMIN"
			? "blue"
			: user.role === "MOD"
				? "warning"
				: "default";

	return (
		<Card className="max-w-2xl mx-auto">
			<CardHeader>
				<div className="flex items-center gap-4">
					<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/20 text-xl font-bold text-blue-400">
						{user.name.charAt(0).toUpperCase()}
					</div>
					<div>
						<CardTitle>{user.name}</CardTitle>
						<CardDescription className="flex items-center gap-2 mt-1">
							<Badge variant={roleVariant}>{user.role}</Badge>
							<Badge variant={user.isActive ? "success" : "danger"}>
								{user.isActive ? "Cuenta Activa" : "Cuenta Inactiva"}
							</Badge>
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4 pt-4 border-t border-slate-800/80">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3.5">
						<div className="flex items-center gap-2 text-xs font-medium text-slate-400">
							<Hash className="h-3.5 w-3.5" />
							ID de Usuario
						</div>
						<p className="mt-1 text-sm font-semibold text-slate-100 font-mono">
							#{user.id}
						</p>
					</div>

					<div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3.5">
						<div className="flex items-center gap-2 text-xs font-medium text-slate-400">
							<Mail className="h-3.5 w-3.5" />
							Correo Electrónico
						</div>
						<p className="mt-1 text-sm font-semibold text-slate-100 truncate">
							{user.email}
						</p>
					</div>

					<div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3.5">
						<div className="flex items-center gap-2 text-xs font-medium text-slate-400">
							<Shield className="h-3.5 w-3.5" />
							Nivel de Autorización
						</div>
						<p className="mt-1 text-sm font-semibold text-slate-100">
							{user.role} (Control Basado en Permisos)
						</p>
					</div>

					<div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3.5">
						<div className="flex items-center gap-2 text-xs font-medium text-slate-400">
							<CheckCircle className="h-3.5 w-3.5" />
							Estado de Verificación
						</div>
						<p className="mt-1 text-sm font-semibold text-emerald-400">
							Autenticado vía JWT
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
