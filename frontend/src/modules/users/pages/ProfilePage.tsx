import { UserProfileCard } from "../components/UserProfileCard";
import { UserCheck } from "lucide-react";

export function ProfilePage() {
	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2.5">
				<div className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
					<UserCheck className="h-5 w-5" />
				</div>
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-white">
						Mi Perfil
					</h1>
					<p className="text-sm text-slate-400">
						Información de la cuenta y detalles de la sesión activa.
					</p>
				</div>
			</div>

			<UserProfileCard />
		</div>
	);
}
