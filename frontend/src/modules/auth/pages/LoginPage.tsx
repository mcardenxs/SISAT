import { Link } from "@tanstack/react-router";
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
				¿No tienes una cuenta?{" "}
				<Link
					to="/register"
					className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
				>
					Regístrate aquí
				</Link>
			</div>
		</AuthLayout>
	);
}
