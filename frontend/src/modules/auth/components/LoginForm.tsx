import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { KeyRound, Sparkles } from "lucide-react";
import { getErrorMessage } from "@/core/api/client";
import { useAuthStore } from "@/core/auth/store";
import { Button } from "@/core/components/ui/Button";
import { Input } from "@/core/components/ui/Input";
import { authApi } from "../api/authApi";
import { type LoginInput, loginSchema } from "../schemas/authSchemas";

function extractErrorMessage(err: unknown): string | undefined {
	if (!err) return undefined;
	if (typeof err === "string") return err;
	if (
		typeof err === "object" &&
		"message" in err &&
		typeof (err as { message?: unknown }).message === "string"
	) {
		return (err as { message: string }).message;
	}
	return String(err);
}

export function LoginForm() {
	const navigate = useNavigate();
	const login = useAuthStore((state) => state.login);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm({
		defaultValues: {
			email: "admin@sisat.local",
			password: "Admin123456!",
		} as LoginInput,
		validators: {
			onChange: loginSchema,
		},
		onSubmit: async ({ value }) => {
			setIsLoading(true);
			try {
				const response = await authApi.login(value);
				login(response);
				toast.success(`¡Bienvenido de nuevo, ${response.user.name}!`);
				navigate({ to: "/dashboard" });
			} catch (error: unknown) {
				toast.error(getErrorMessage(error));
			} finally {
				setIsLoading(false);
			}
		},
	});

	const fillDemo = (email: string, pass: string) => {
		form.setFieldValue("email", email);
		form.setFieldValue("password", pass);
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-4"
		>
			<form.Field name="email">
				{(field) => (
					<Input
						label="Correo Electrónico"
						type="email"
						placeholder="usuario@ejemplo.com"
						autoComplete="email"
						value={field.state.value}
						onBlur={field.handleBlur}
						onChange={(e) => field.handleChange(e.target.value)}
						error={extractErrorMessage(field.state.meta.errors[0])}
					/>
				)}
			</form.Field>

			<form.Field name="password">
				{(field) => (
					<Input
						label="Contraseña"
						type="password"
						placeholder="••••••••••••"
						autoComplete="current-password"
						value={field.state.value}
						onBlur={field.handleBlur}
						onChange={(e) => field.handleChange(e.target.value)}
						error={extractErrorMessage(field.state.meta.errors[0])}
					/>
				)}
			</form.Field>

			<Button
				type="submit"
				className="w-full mt-2"
				size="lg"
				isLoading={isLoading}
			>
				<KeyRound className="h-4 w-4 mr-1.5" />
				Iniciar Sesión
			</Button>

			<div className="pt-4 border-t border-slate-800">
				<p className="text-xs text-slate-400 mb-2 font-medium">
					Credenciales de prueba del sistema:
				</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => fillDemo("admin@sisat.local", "Admin123456!")}
						className="text-xs text-indigo-300 border-indigo-900/50 hover:bg-indigo-950/40 justify-start"
					>
						<Sparkles className="h-3.5 w-3.5 text-indigo-400 mr-1.5 shrink-0" />
						Admin General
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() =>
							fillDemo("carlos.mendoza@sisat.local", "Password123!")
						}
						className="text-xs text-emerald-300 border-emerald-900/50 hover:bg-emerald-950/40 justify-start"
					>
						<Sparkles className="h-3.5 w-3.5 text-emerald-400 mr-1.5 shrink-0" />
						Responsable (SIA)
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() =>
							fillDemo("alejandro.torres@sisat.local", "Password123!")
						}
						className="text-xs text-amber-300 border-amber-900/50 hover:bg-amber-950/40 justify-start"
					>
						<Sparkles className="h-3.5 w-3.5 text-amber-400 mr-1.5 shrink-0" />
						Desarrollador
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() =>
							fillDemo("patricia.solis@sisat.local", "Password123!")
						}
						className="text-xs text-cyan-300 border-cyan-900/50 hover:bg-cyan-950/40 justify-start"
					>
						<Sparkles className="h-3.5 w-3.5 text-cyan-400 mr-1.5 shrink-0" />
						Jefa de Área
					</Button>
				</div>
			</div>
		</form>
	);
}
