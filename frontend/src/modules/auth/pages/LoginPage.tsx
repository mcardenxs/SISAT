import { AuthLayout } from "@/core/components/layout/AuthLayout";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
	return (
		<AuthLayout
			title="Iniciar Sesión"
			subtitle="Ingresa tus credenciales para acceder a SISAT"
		>
			<LoginForm />
			<div className="mt-6 text-center text-xs text-slate-400">
				Acceso restringido a personal institucional. Si requieres una cuenta o
				restablecer tu contraseña, contacta a la Dirección de TI.
			</div>
		</AuthLayout>
	);
}
