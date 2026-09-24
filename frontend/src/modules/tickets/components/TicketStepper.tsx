import { Check, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/core/utils/cn";

interface TicketStepperProps {
	faseCodigo?: string;
}

const STEPS = [
	{ codigo: "REGISTRADO", label: "Registrado", num: 1 },
	{ codigo: "ASIGNADO", label: "Asignado", num: 2 },
	{ codigo: "EN_PROCESO", label: "En Proceso", num: 3 },
	{ codigo: "RESUELTO_POR_DESARROLLO", label: "Resuelto", num: 4 },
	{ codigo: "CERRADO_POR_RESPONSABLE", label: "Cerrado", num: 5 },
];

export function TicketStepper({ faseCodigo }: TicketStepperProps) {
	const isSpecialState =
		faseCodigo === "EN_ESPERA_DE_INFORMACION" ||
		faseCodigo === "CANCELADO" ||
		faseCodigo === "REABIERTO";

	let currentStepIndex = STEPS.findIndex((s) => s.codigo === faseCodigo);
	if (faseCodigo === "EN_ESPERA_DE_INFORMACION" || faseCodigo === "REABIERTO") {
		currentStepIndex = 2; // se encuentra en etapa de proceso/atención
	}

	return (
		<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
			{isSpecialState && (
				<div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
					<AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
					<span>
						Estado operativo especial: <strong>{faseCodigo}</strong>.
					</span>
				</div>
			)}

			<div className="relative flex items-center justify-between">
				{/* Barra conectora de fondo */}
				<div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 -z-0" />

				{STEPS.map((step, idx) => {
					const isCompleted = currentStepIndex > idx;
					const isCurrent = currentStepIndex === idx;

					return (
						<div
							key={step.codigo}
							className="relative z-10 flex flex-col items-center group"
						>
							<div
								className={cn(
									"flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-all duration-200 border-2",
									isCompleted
										? "border-emerald-500 bg-emerald-500 text-slate-950 shadow-emerald-500/20 shadow-md"
										: isCurrent
											? "border-indigo-500 bg-indigo-600 text-white shadow-indigo-500/30 shadow-lg ring-4 ring-indigo-500/20"
											: "border-slate-800 bg-slate-900 text-slate-500",
								)}
							>
								{isCompleted ? (
									<Check className="h-4 w-4 stroke-[2.5]" />
								) : isCurrent ? (
									<Clock className="h-4 w-4 animate-pulse" />
								) : (
									step.num
								)}
							</div>
							<span
								className={cn(
									"mt-2 text-xs font-medium tracking-tight transition-colors text-center hidden sm:block",
									isCurrent
										? "text-indigo-400 font-semibold"
										: isCompleted
											? "text-slate-300"
											: "text-slate-500",
								)}
							>
								{step.label}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
