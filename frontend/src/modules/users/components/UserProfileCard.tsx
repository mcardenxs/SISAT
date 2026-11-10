import { useAuthStore } from "@/core/auth/store";
import { formatRole } from "@/core/utils/roleUtils";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/core/components/ui/Card";
import { Shield, Mail, CheckCircle } from "lucide-react";

export function UserProfileCard() {
	const user = useAuthStore((state) => state.user);

	if (!user) {
		return (
			<Card>
				<p className="text-sm text-foreground-muted">
					No hay información de sesión activa.
				</p>
			</Card>
		);
	}

	return (
		<Card className="max-w-2xl mx-auto shadow-surface">
			<CardHeader>
				<div className="flex items-center gap-4">
					<div className="flex h-14 w-14 items-center justify-center rounded-control bg-primary-light border border-primary-border text-xl font-bold text-primary">
						{user.name.charAt(0).toUpperCase()}
					</div>
					<div>
						<CardTitle>{user.name}</CardTitle>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4 pt-4 border-t border-subtle">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div className="rounded-control border border-subtle bg-surface-subtle p-3.5">
						<div className="flex items-center gap-2 text-xs font-medium text-foreground-muted">
							<Mail className="h-3.5 w-3.5" />
							Correo Electrónico
						</div>
						<p className="mt-1 text-sm font-semibold text-foreground truncate">
							{user.email}
						</p>
					</div>

					<div className="rounded-control border border-subtle bg-surface-subtle p-3.5">
						<div className="flex items-center gap-2 text-xs font-medium text-foreground-muted">
							<Shield className="h-3.5 w-3.5" />
							Nivel de Autorización
						</div>
						<p className="mt-1 text-sm font-semibold text-foreground">
							{formatRole(user.role)} (Control Basado en Permisos)
						</p>
					</div>

					<div className="rounded-control border border-subtle bg-surface-subtle p-3.5">
						<div className="flex items-center gap-2 text-xs font-medium text-foreground-muted">
							<CheckCircle className="h-3.5 w-3.5 text-success" />
							Estado de Verificación
						</div>
						<p className="mt-1 text-sm font-semibold text-success">
							Autenticado vía JWT
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
