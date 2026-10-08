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
			return "neutral" as const;
		case "ASIGNADO":
			return "info" as const;
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
			return "neutral" as const;
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
				<span className="font-mono text-xs font-semibold text-primary">
					{info.getValue()}
				</span>
			),
		}),
		columnHelper.accessor("titulo", {
			header: "Título",
			cell: (info) => (
				<div className="max-w-xs truncate font-medium text-foreground">
					{info.getValue()}
				</div>
			),
		}),
		columnHelper.accessor("sistemaNombre", {
			header: "Sistema",
			cell: (info) => (
				<span className="text-xs text-foreground-muted">
					{info.getValue() || "N/A"}
				</span>
			),
		}),
		columnHelper.accessor("faseNombre", {
			header: "Fase",
			cell: (info) => {
				const ticket = info.row.original;
				const isWaiting = ticket.faseCodigo === "EN_ESPERA_DE_INFORMACION";
				return (
					<div className="flex flex-col gap-0.5 items-start">
						<Badge
							variant={getFaseVariant(ticket.faseCodigo)}
							className={
								isWaiting
									? "border border-amber-400/50 bg-amber-500/20 text-amber-300 font-semibold"
									: undefined
							}
						>
							{ticket.faseNombre || ticket.faseCodigo}
						</Badge>
						{isWaiting && (
							<span className="text-[10px] text-amber-400 font-medium">
								⚠️ Requiere info
							</span>
						)}
					</div>
				);
			},
		}),
		columnHelper.accessor("prioridadNombre", {
			header: "Prioridad",
			cell: (info) => (
				<span className="text-xs text-foreground-muted font-medium">
					{info.getValue() || "Normal"}
				</span>
			),
		}),
		columnHelper.accessor("registro", {
			header: "Antigüedad",
			cell: (info) => (
				<span className="inline-flex items-center gap-1 text-[11px] text-foreground-subtle">
					<Clock className="h-3 w-3" />
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
					className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover"
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
		<div className="overflow-hidden rounded-surface border border-subtle bg-surface shadow-surface">
			<div className="overflow-x-auto">
				<table className="w-full text-left text-xs">
					<thead className="border-b border-subtle bg-surface-subtle uppercase tracking-wider text-foreground-muted">
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
					<tbody className="divide-y divide-subtle">
						{table.getRowModel().rows.map((row) => (
							<tr
								key={row.id}
								className="hover:bg-surface-muted/50 transition-colors"
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
