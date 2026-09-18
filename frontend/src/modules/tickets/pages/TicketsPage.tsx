import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ticketApi } from "../api/ticketApi";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from "@/core/components/ui/Card";
import { Badge } from "@/core/components/ui/Badge";
import { Button } from "@/core/components/ui/Button";
import { Ticket as TicketIcon, Clock, User, Server, Plus } from "lucide-react";
import { CreateTicketModal } from "../components/CreateTicketModal";

export function TicketsPage() {
	const {
		data: tickets,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["tickets"],
		queryFn: () => ticketApi.getAll(),
	});

	const getFaseVariant = (codigo?: string) => {
		switch (codigo) {
			case "REGISTRADO":
				return "default";
			case "ASIGNADO":
				return "purple";
			case "EN_PROCESO":
				return "info";
			case "RESUELTO_POR_DESARROLLO":
				return "warning";
			case "CERRADO_POR_RESPONSABLE":
				return "success";
			default:
				return "default";
		}
	};

	if (isLoading) {
		return (
			<div className="p-8 text-center text-slate-400">
				Cargando tickets de soporte...
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-8 text-center text-rose-400">
				Error al cargar tickets de soporte.
			</div>
		);
	}

	const [isCreateOpen, setIsCreateOpen] = useState(false);

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
						Tickets de Soporte
					</h1>
					<p className="text-sm text-slate-400 mt-1">
						Registro y seguimiento integral de atenciones técnicas en sistemas
						institucionales.
					</p>
				</div>
				<Button
					onClick={() => setIsCreateOpen(true)}
					className="gap-2 self-start sm:self-auto"
				>
					<Plus className="h-4 w-4" />
					Nuevo Ticket
				</Button>
			</div>

			<CreateTicketModal
				isOpen={isCreateOpen}
				onClose={() => setIsCreateOpen(false)}
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{tickets?.map((ticket) => (
					<Card
						key={ticket.id}
						className="border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors"
					>
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between gap-2">
								<div>
									<span className="font-mono text-xs text-indigo-400 font-semibold">
										{ticket.folio}
									</span>
									<CardTitle className="text-base font-semibold text-white mt-0.5">
										{ticket.titulo}
									</CardTitle>
								</div>
								<Badge variant={getFaseVariant(ticket.faseCodigo)}>
									{ticket.faseNombre || ticket.faseCodigo}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-3 text-xs">
							<p className="text-slate-300 line-clamp-2">
								{ticket.descripcion}
							</p>

							<div className="border-t border-slate-800 pt-3 space-y-1.5">
								<div className="flex items-center gap-1.5 text-slate-400">
									<Server className="h-3.5 w-3.5 text-indigo-400" />
									<span className="font-medium text-slate-200">
										{ticket.sistemaNombre}
									</span>
									<span className="text-slate-500">({ticket.areaNombre})</span>
								</div>
								<div className="flex items-center gap-1.5 text-slate-400">
									<User className="h-3.5 w-3.5 text-slate-500" />
									<span>
										Solicitante:{" "}
										<span className="text-slate-300">
											{ticket.usuarioNombre}
										</span>
									</span>
								</div>
							</div>

							<div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[11px] text-slate-500">
								<div className="flex items-center gap-1">
									<Clock className="h-3 w-3" />
									<span>{new Date(ticket.registro).toLocaleDateString()}</span>
								</div>
								<span className="text-slate-400">
									{ticket.atenciones?.length || 0} ciclo(s) de atención
								</span>
							</div>
						</CardContent>
					</Card>
				))}

				{tickets?.length === 0 && (
					<div className="col-span-full p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-400">
						<TicketIcon className="h-8 w-8 mx-auto text-slate-600 mb-2" />
						No hay tickets de soporte registrados.
					</div>
				)}
			</div>
		</div>
	);
}
