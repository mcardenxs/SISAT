import {
	useReactTable,
	getCoreRowModel,
	flexRender,
	createColumnHelper,
} from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import type { Ticket } from "../api/types";
import { Badge } from "@/core/components/ui/Badge";
import { Clock, ExternalLink } from "lucide-react";

interface TicketTableViewProps {
	tickets: Ticket[];
}

const columnHelper = createColumnHelper<Ticket>();

export function getFaseVariant(codigo?: string) {
	switch (codigo) {
		case "REGISTRADO":
			return "default" as const;
		case "ASIGNADO":
			return "purple" as const;
		case "EN_PROCESO":
			return "info" as const;
		case "RESUELTO_POR_DESARROLLO":
			return "warning" as const;
		case "CERRADO_POR_RESPONSABLE":
			return "success" as const;
		case "EN_ESPERA_DE_INFORMACION":
			return "warning" as const;
		case "CANCELADO":
			return "danger" as const;
		default:
			return "default" as const;
	}
}

export function formatTimeAgo(dateString: string): string {
	const diffMs = Date.now() - new Date(dateString).getTime();
	const diffMin = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMin / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffMin < 60) return `hace ${Math.max(1, diffMin)} min`;
	if (diffHours < 24) return `hace ${diffHours} h`;
	return `hace ${diffDays} d`;
}

export function TicketTableView({ tickets }: TicketTableViewProps) {
	const columns = [
		columnHelper.accessor("folio", {
			header: "Folio",
			cell: (info) => (
				<span className="font-mono text-xs font-semibold text-indigo-400">
					{info.getValue()}
				</span>
			),
		}),
		columnHelper.accessor("titulo", {
			header: "Título",
			cell: (info) => (
				<div className="max-w-xs truncate font-medium text-slate-200">
					{info.getValue()}
				</div>
			),
		}),
		columnHelper.accessor("sistemaNombre", {
			header: "Sistema",
			cell: (info) => (
				<span className="text-xs text-slate-300">
					{info.getValue() || "N/A"}
				</span>
			),
		}),
		columnHelper.accessor("faseNombre", {
			header: "Fase",
			cell: (info) => {
				const ticket = info.row.original;
				return (
					<Badge variant={getFaseVariant(ticket.faseCodigo)}>
						{ticket.faseNombre || ticket.faseCodigo}
					</Badge>
				);
			},
		}),
		columnHelper.accessor("prioridadNombre", {
			header: "Prioridad",
			cell: (info) => (
				<span className="text-xs text-slate-300 font-medium">
					{info.getValue() || "Normal"}
				</span>
			),
		}),
		columnHelper.accessor("registro", {
			header: "Antigüedad",
			cell: (info) => (
				<span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
					<Clock className="h-3 w-3 text-slate-500" />
					{formatTimeAgo(info.getValue())}
				</span>
			),
		}),
		columnHelper.display({
			id: "acciones",
			header: "Acción",
			cell: (info) => (
				<Link
					to="/tickets/$ticketId"
					params={{ ticketId: String(info.row.original.id) }}
					className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300"
				>
					Ver detalle
					<ExternalLink className="h-3 w-3" />
				</Link>
			),
		}),
	];

	const table = useReactTable({
		data: tickets,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
			<div className="overflow-x-auto">
				<table className="w-full text-left text-xs">
					<thead className="border-b border-slate-800 bg-slate-900/90 uppercase tracking-wider text-slate-400">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th key={header.id} className="px-5 py-3.5 font-semibold">
										{flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody className="divide-y divide-slate-800/60">
						{table.getRowModel().rows.map((row) => (
							<tr
								key={row.id}
								className="hover:bg-slate-800/30 transition-colors"
							>
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id} className="px-5 py-3">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
