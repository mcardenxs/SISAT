import { Link } from "@tanstack/react-router";
import { AuthLayout } from "@/core/components/layout/AuthLayout";
import { RegisterForm } from "../components/RegisterForm";

export function RegisterPage() {
	return (
		<AuthLayout
			title="Crear Cuenta"
			subtitle="Únete a la plataforma completando tus datos"
		>
			<RegisterForm />
			<div className="mt-6 text-center text-xs text-slate-400">
				¿Ya tienes una cuenta?{" "}
				<Link
					to="/login"
					className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
				>
					Inicia sesión
				</Link>
			</div>
		</AuthLayout>
	);
}
