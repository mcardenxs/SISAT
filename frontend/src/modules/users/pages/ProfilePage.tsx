import { UserProfileCard } from "../components/UserProfileCard";
import { PageHeader } from "@/core/components/ui/PageHeader";

export function ProfilePage() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Mi Perfil"
				description="Información de la cuenta y detalles de la sesión activa."
			/>
			<UserProfileCard />
		</div>
	);
}
