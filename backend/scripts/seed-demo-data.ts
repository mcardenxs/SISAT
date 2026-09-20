import { prisma } from "../src/core/config/prisma";
import bcrypt from "bcrypt";

async function main() {
	console.log("🌱 =========================================================");
	console.log("🌱 INICIANDO POBLADO DE DATOS DE PRUEBA DEL SISTEMA SISAT");
	console.log("🌱 =========================================================\n");

	// 1. Roles y Catálogos requeridos
	const roles = await prisma.rol.findMany();
	const roleMap = new Map(roles.map((r) => [r.rol_codigo, r.rol_id]));

	const fases = await prisma.fase.findMany();
	const faseMap = new Map(fases.map((f) => [f.fas_codigo, f.fas_id]));

	const prioridades = await prisma.prioridad.findMany();
	const prioMap = new Map(prioridades.map((p) => [p.pri_codigo, p.pri_id]));

	const solicitudes = await prisma.solicitud.findMany();
	const solMap = new Map(solicitudes.map((s) => [s.sol_codigo, s.sol_id]));

	const clases = await prisma.clase.findMany();
	const claseMap = new Map(clases.map((c) => [c.cla_codigo, c.cla_id]));

	const situaciones = await prisma.situacion.findMany();
	const sitMap = new Map(situaciones.map((s) => [s.sit_codigo, s.sit_id]));

	const constanciaNoAplica = await prisma.constancia.findUnique({
		where: { con_codigo: "NO_APLICA" },
	});
	if (!constanciaNoAplica) throw new Error("Constancia NO_APLICA no existe");

	// 2. Asegurar Áreas
	console.log("🏢 1. Configurando Áreas de la Institución...");
	const areaData = [
		{
			id: 1,
			nombre: "Tecnologías de la Información",
			desc: "Área de TI y Sistemas",
		},
		{
			id: 2,
			nombre: "Recursos Humanos",
			desc: "Gestión de talento humano, nóminas y contrataciones",
		},
		{
			id: 3,
			nombre: "Finanzas y Contabilidad",
			desc: "Presupuestos, cuentas por pagar y auditorías financieras",
		},
		{
			id: 4,
			nombre: "Servicios Escolares",
			desc: "Inscripciones, expedientes y titulación de alumnos",
		},
		{
			id: 5,
			nombre: "Planeación y Evaluación",
			desc: "Estadísticas institucionales e indicadores de desempeño",
		},
	];

	for (const a of areaData) {
		await prisma.area.upsert({
			where: { are_id: a.id },
			update: {
				are_nombre: a.nombre,
				are_descripcion: a.desc,
				are_fkestado: 1,
			},
			create: {
				are_id: a.id,
				are_nombre: a.nombre,
				are_descripcion: a.desc,
				are_fkestado: 1,
			},
		});
	}
	console.log("   ✅ 5 Áreas institucionales sincronizadas.");

	// 3. Crear o Asegurar Usuarios de Prueba
	console.log("\n👥 2. Configurando Cuentas de Usuario y Roles RBAC...");
	const passwordHash = await bcrypt.hash("Password123!", 10);
	const adminPassHash = await bcrypt.hash("Admin123456!", 10);

	const usersConfig = [
		{
			email: "admin@sisat.local",
			nombre: "Administrador",
			apellido: "SISAT",
			puesto: "Administrador General del Sistema",
			areaId: 1,
			password: adminPassHash,
			roles: [
				"ADMINISTRADOR",
				"RESPONSABLE_DE_SISTEMA",
				"DESARROLLADOR",
				"JEFE_DE_AREA",
			],
		},
		{
			email: "carlos.mendoza@sisat.local",
			nombre: "Carlos",
			apellido: "Mendoza Silva",
			puesto: "Responsable de Sistemas Escolares",
			areaId: 4,
			password: passwordHash,
			roles: ["RESPONSABLE_DE_SISTEMA", "CONSULTA"],
		},
		{
			email: "laura.garcia@sisat.local",
			nombre: "Laura",
			apellido: "García Morales",
			puesto: "Coordinadora de Finanzas y Sistemas",
			areaId: 3,
			password: passwordHash,
			roles: ["RESPONSABLE_DE_SISTEMA"],
		},
		{
			email: "alejandro.torres@sisat.local",
			nombre: "Alejandro",
			apellido: "Torres Vega",
			puesto: "Desarrollador Full Stack Senior",
			areaId: 1,
			password: passwordHash,
			roles: ["DESARROLLADOR"],
		},
		{
			email: "mariana.rios@sisat.local",
			nombre: "Mariana",
			apellido: "Ríos Domínguez",
			puesto: "Ingeniera de Software Backend",
			areaId: 1,
			password: passwordHash,
			roles: ["DESARROLLADOR"],
		},
		{
			email: "roberto.navarro@sisat.local",
			nombre: "Dr. Roberto",
			apellido: "Navarro Peña",
			puesto: "Director de Tecnologías de la Información",
			areaId: 1,
			password: passwordHash,
			roles: ["JEFE_DE_AREA", "ADMINISTRADOR"],
		},
		{
			email: "patricia.solis@sisat.local",
			nombre: "Lic. Patricia",
			apellido: "Solís Valenzuela",
			puesto: "Directora de Servicios Escolares",
			areaId: 4,
			password: passwordHash,
			roles: ["JEFE_DE_AREA", "CONSULTA"],
		},
	];

	const userMap = new Map<string, number>();

	for (const u of usersConfig) {
		let user = await prisma.usuario.findUnique({
			where: { usu_correo: u.email },
			include: { perfil: true },
		});

		if (!user) {
			user = await prisma.usuario.create({
				data: {
					usu_correo: u.email,
					usu_nombre: u.nombre,
					usu_apellido: u.apellido,
					usu_puesto: u.puesto,
					usu_fkarea: u.areaId,
					usu_fkestado: 1,
					usu_contrasena: u.password,
				},
				include: { perfil: true },
			});
		} else {
			await prisma.usuario.update({
				where: { usu_id: user.usu_id },
				data: {
					usu_fkarea: u.areaId,
					usu_fkestado: 1,
					usu_puesto: u.puesto,
				},
			});
		}

		userMap.set(u.email, user.usu_id);

		// Asociar perfiles/roles
		const existingRoles = new Set(user.perfil.map((p) => p.per_fkrol));
		for (const roleCode of u.roles) {
			const roleId = roleMap.get(roleCode);
			if (roleId && !existingRoles.has(roleId)) {
				await prisma.perfil.create({
					data: {
						per_fkusuario: user.usu_id,
						per_fkrol: roleId,
					},
				});
			}
		}
	}
	console.log(`   ✅ ${usersConfig.length} Cuentas configuradas.`);

	// 4. Configurar Sistemas Institucionales
	console.log("\n💻 3. Configurando Sistemas y sus Equipos Asignados...");
	const sistemasConfig = [
		{
			id: 2,
			clave: "SIA-ALUMNOS",
			nombre: "Sistema Integral de Alumnos (SIA)",
			desc: "Portal web para inscripciones, boletas, historiales académicos y titulación.",
			areaId: 4,
			url: "https://sia.institucional.edu.mx",
			responsableEmail: "carlos.mendoza@sisat.local",
			desarrolladoresEmails: [
				"alejandro.torres@sisat.local",
				"mariana.rios@sisat.local",
			],
		},
		{
			id: 3,
			clave: "SIPRE-FINANZAS",
			nombre: "Sistema de Control Presupuestal y Facturación",
			desc: "Gestión contable, seguimiento de pagos a proveedores y timbrado CFDI 4.0.",
			areaId: 3,
			url: "https://finanzas.institucional.edu.mx",
			responsableEmail: "laura.garcia@sisat.local",
			desarrolladoresEmails: ["alejandro.torres@sisat.local"],
		},
		{
			id: 4,
			clave: "RH-TALENTO",
			nombre: "Plataforma de Expediente Digital y Nómina RH",
			desc: "Gestión de incidencias de personal, checador biométrico y constancias laborales.",
			areaId: 2,
			url: "https://rh.institucional.edu.mx",
			responsableEmail: "admin@sisat.local",
			desarrolladoresEmails: ["admin@sisat.local", "mariana.rios@sisat.local"],
		},
	];

	for (const s of sistemasConfig) {
		await prisma.sistema.upsert({
			where: { sis_id: s.id },
			update: {
				sis_clave: s.clave,
				sis_nombre: s.nombre,
				sis_descripcion: s.desc,
				sis_fkarea: s.areaId,
				sis_fkestado: 1,
				sis_url: s.url,
			},
			create: {
				sis_id: s.id,
				sis_clave: s.clave,
				sis_nombre: s.nombre,
				sis_descripcion: s.desc,
				sis_fkarea: s.areaId,
				sis_fkestado: 1,
				sis_url: s.url,
			},
		});
	}
	console.log("   ✅ 3 Sistemas principales con sus responsables y técnicos.");

	// 5. Creación de Tickets en todos los estados del ciclo de vida
	console.log(
		"\n🎫 4. Generando Tickets en las diferentes fases operativas...",
	);

	const uCarlos = userMap.get("carlos.mendoza@sisat.local")!;
	const uLaura = userMap.get("laura.garcia@sisat.local")!;
	const uAlejandro = userMap.get("alejandro.torres@sisat.local")!;
	const uMariana = userMap.get("mariana.rios@sisat.local")!;

	// Helper para folios
	let ticketCounter = (await prisma.ticket.count()) + 1;
	const nextFolio = () => {
		const folio = `TIC-202609-${String(ticketCounter).padStart(4, "0")}`;
		ticketCounter++;
		return folio;
	};

	// ----------------------------------------------------------------------------------
	// Ticket A: REGISTRADO (Nuevo ticket recién abierto, esperando asignación)
	// ----------------------------------------------------------------------------------
	const ticketA = await prisma.ticket.create({
		data: {
			tic_folio: nextFolio(),
			tic_titulo: "Error 500 al generar boleta de calificaciones en PDF",
			tic_descripcion:
				"Los coordinadores académicos reportan que al intentar exportar la boleta oficial de alumnos del ciclo 2026-A la página arroja un error interno del servidor.",
			tic_fksistema: 2, // SIA-ALUMNOS
			tic_fkarea: 4, // Servicios Escolares
			tic_fkusuario: uCarlos,
			tic_fkprioridad: prioMap.get("ALTA")!,
			tic_fksolicitud: solMap.get("ERROR")!,
			tic_fkfase: faseMap.get("REGISTRADO")!,
			tic_fkconstancia: constanciaNoAplica.con_id,
		},
	});
	console.log(
		`   📌 [REGISTRADO] ${ticketA.tic_folio}: "${ticketA.tic_titulo}"`,
	);

	// ----------------------------------------------------------------------------------
	// Ticket B: ASIGNADO (Asignado a Mariana Ríos, pendiente de atención técnica)
	// ----------------------------------------------------------------------------------
	const ticketB = await prisma.ticket.create({
		data: {
			tic_folio: nextFolio(),
			tic_titulo: "Actualización de catálogo de materias optativas 2026-B",
			tic_descripcion:
				"Se requiere registrar 12 nuevas materias optativas aprobadas por el consejo académico con sus respectivos créditos y prerrequisitos.",
			tic_fksistema: 2, // SIA-ALUMNOS
			tic_fkarea: 4, // Servicios Escolares
			tic_fkusuario: uCarlos,
			tic_fkprioridad: prioMap.get("MEDIA")!,
			tic_fksolicitud: solMap.get("AJUSTE_DE_INFORMACION")!,
			tic_fkfase: faseMap.get("REGISTRADO")!,
			tic_fkconstancia: constanciaNoAplica.con_id,
		},
	});

	await prisma.asignacion.create({
		data: {
			asi_fkticket: ticketB.tic_id,
			asi_fkusuario: uMariana,
			asi_fkestado: 1,
			asi_fkusuario_asigna: uCarlos,
			asi_principal: true,
			asi_fin: null,
		},
	});

	await prisma.ticket.update({
		where: { tic_id: ticketB.tic_id },
		data: { tic_fkfase: faseMap.get("ASIGNADO")! },
	});

	await prisma.transicion.create({
		data: {
			tra_fkticket: ticketB.tic_id,
			tra_fkfase_origen: faseMap.get("REGISTRADO")!,
			tra_fkfase_destino: faseMap.get("ASIGNADO")!,
			tra_fkusuario: uCarlos,
			tra_comentario: "Ticket asignado a desarrolladora Mariana Ríos",
		},
	});
	console.log(
		`   📌 [ASIGNADO]   ${ticketB.tic_folio}: "${ticketB.tic_titulo}"`,
	);

	// ----------------------------------------------------------------------------------
	// Ticket C: EN_PROCESO (Con ciclo de atención activo y 2 intervenciones con minutos)
	// ----------------------------------------------------------------------------------
	const ticketC = await prisma.ticket.create({
		data: {
			tic_folio: nextFolio(),
			tic_titulo:
				"Inconsistencia en el cálculo de retención de IVA en CFDI 4.0",
			tic_descripcion:
				"El cálculo de retención de IVA del 6% para prestadores de servicios profesionales está truncando decimales en lugar de redondear a 2 dígitos.",
			tic_fksistema: 3, // SIPRE-FINANZAS
			tic_fkarea: 3, // Finanzas y Contabilidad
			tic_fkusuario: uLaura,
			tic_fkprioridad: prioMap.get("CRITICA")!,
			tic_fksolicitud: solMap.get("ERROR")!,
			tic_fkfase: faseMap.get("REGISTRADO")!,
			tic_fkconstancia: constanciaNoAplica.con_id,
		},
	});

	await prisma.asignacion.create({
		data: {
			asi_fkticket: ticketC.tic_id,
			asi_fkusuario: uAlejandro,
			asi_fkestado: 1,
			asi_fkusuario_asigna: uLaura,
			asi_principal: true,
			asi_fin: null,
		},
	});

	await prisma.ticket.update({
		where: { tic_id: ticketC.tic_id },
		data: { tic_fkfase: faseMap.get("ASIGNADO")! },
	});

	const atencionC = await prisma.atencion.create({
		data: {
			ate_fkticket: ticketC.tic_id,
			ate_ciclo: 1,
			ate_inicio: new Date(Date.now() - 10 * 3600 * 1000),
			ate_diagnostico:
				"Se identificó discrepancia en la función Math.floor utilizada en el middleware de timbrado con el SAT.",
		},
	});

	await prisma.ticket.update({
		where: { tic_id: ticketC.tic_id },
		data: { tic_fkfase: faseMap.get("EN_PROCESO")! },
	});

	await prisma.intervencion.create({
		data: {
			int_fkatencion: atencionC.ate_id,
			int_fkusuario: uAlejandro,
			int_descripcion:
				"Análisis de trazas de facturas timbradas con error en PAC de pruebas",
			int_minutos: 60,
			int_interno: true,
		},
	});

	await prisma.intervencion.create({
		data: {
			int_fkatencion: atencionC.ate_id,
			int_fkusuario: uAlejandro,
			int_descripcion:
				"Ajuste en la regla de redondeo bancario estándar (Half-up) a dos posiciones decimales",
			int_minutos: 90,
			int_interno: false,
		},
	});

	await prisma.evidencia.create({
		data: {
			evi_fkticket: ticketC.tic_id,
			evi_fkatencion: null,
			evi_fkclase: claseMap.get("EVIDENCIA_INICIAL")!,
			evi_fkusuario: uLaura,
			evi_nombre: "captura_error_retencion_iva.png",
			evi_ruta: "/uploads/tickets/evidencia_retencion.png",
			evi_formato: "png",
			evi_tamano: 245000,
			evi_descripcion: "Captura de pantalla enviada por el contador general",
		},
	});

	await prisma.transicion.create({
		data: {
			tra_fkticket: ticketC.tic_id,
			tra_fkfase_origen: faseMap.get("ASIGNADO")!,
			tra_fkfase_destino: faseMap.get("EN_PROCESO")!,
			tra_fkusuario: uAlejandro,
			tra_comentario: "Inicio de atención y revisión técnica de logs",
		},
	});
	console.log(
		`   📌 [EN_PROCESO] ${ticketC.tic_folio}: "${ticketC.tic_titulo}"`,
	);

	// ----------------------------------------------------------------------------------
	// Ticket D: RESUELTO_POR_DESARROLLO (Atención concluida, con evidencia final y término)
	// ----------------------------------------------------------------------------------
	const ticketD = await prisma.ticket.create({
		data: {
			tic_folio: nextFolio(),
			tic_titulo:
				"Optimización en consulta de saldos presupuestales por centro de costo",
			tic_descripcion:
				"El reporte de saldos mensuales tardaba más de 45 segundos al procesar más de 50 centros de costo.",
			tic_fksistema: 3, // SIPRE-FINANZAS
			tic_fkarea: 3, // Finanzas y Contabilidad
			tic_fkusuario: uLaura,
			tic_fkprioridad: prioMap.get("ALTA")!,
			tic_fksolicitud: solMap.get("MEJORA")!,
			tic_fkfase: faseMap.get("REGISTRADO")!,
			tic_fkconstancia: constanciaNoAplica.con_id,
		},
	});

	const asiDateD = new Date(Date.now() - 40 * 3600 * 1000);
	await prisma.asignacion.create({
		data: {
			asi_fkticket: ticketD.tic_id,
			asi_fkusuario: uAlejandro,
			asi_fkestado: 1,
			asi_fkusuario_asigna: uLaura,
			asi_principal: true,
			asi_fecha: asiDateD,
			asi_fin: null,
		},
	});

	const ateDateD = new Date(Date.now() - 38 * 3600 * 1000);
	const atencionD = await prisma.atencion.create({
		data: {
			ate_fkticket: ticketD.tic_id,
			ate_ciclo: 1,
			ate_inicio: ateDateD,
			ate_diagnostico:
				"Se detectó un N+1 en la consulta ORM que traía las pólizas sin paginación.",
			ate_solucion:
				"Se reescribió la consulta a nivel de MariaDB con vista indexada y paginación en bloque.",
			ate_cambios: "Stored procedure y servicio de reportes optimizados.",
			ate_modulos: "Módulo de Reportes Contables",
			ate_datos: "Tabla polizas_contables",
			ate_comentarios:
				"Tiempo de ejecución reducido de 45s a 1.2s en ambiente de pruebas.",
		},
	});

	await prisma.intervencion.create({
		data: {
			int_fkatencion: atencionD.ate_id,
			int_fkusuario: uAlejandro,
			int_descripcion: "Diagnóstico y análisis con EXPLAIN sobre MariaDB",
			int_minutos: 75,
			int_interno: true,
			int_fecha: new Date(Date.now() - 30 * 3600 * 1000),
		},
	});

	await prisma.evidencia.create({
		data: {
			evi_fkticket: ticketD.tic_id,
			evi_fkatencion: atencionD.ate_id,
			evi_fkclase: claseMap.get("EVIDENCIA_FINAL")!,
			evi_fkusuario: uAlejandro,
			evi_nombre: "benchmark_comparativo_rendimiento.pdf",
			evi_ruta: "/uploads/tickets/benchmark_sipre.pdf",
			evi_formato: "pdf",
			evi_tamano: 412000,
			evi_descripcion: "Pruebas de carga comparativas antes y después",
			evi_fecha: new Date(Date.now() - 25 * 3600 * 1000),
		},
	});

	await prisma.termino.create({
		data: {
			ter_fkatencion: atencionD.ate_id,
			ter_fkusuario: uAlejandro,
			ter_fecha: new Date(Date.now() - 20 * 3600 * 1000),
		},
	});

	await prisma.ticket.update({
		where: { tic_id: ticketD.tic_id },
		data: { tic_fkfase: faseMap.get("RESUELTO_POR_DESARROLLO")! },
	});

	await prisma.transicion.create({
		data: {
			tra_fkticket: ticketD.tic_id,
			tra_fkfase_origen: faseMap.get("EN_PROCESO")!,
			tra_fkfase_destino: faseMap.get("RESUELTO_POR_DESARROLLO")!,
			tra_fkusuario: uAlejandro,
			tra_comentario: "Atención técnica completada y verificada",
		},
	});
	console.log(
		`   📌 [RESUELTO]   ${ticketD.tic_folio}: "${ticketD.tic_titulo}"`,
	);

	// ----------------------------------------------------------------------------------
	// Ticket E: CERRADO_POR_RESPONSABLE (SIA-ALUMNOS, evaluado con 5 estrellas)
	// ----------------------------------------------------------------------------------
	const ticketE = await prisma.ticket.create({
		data: {
			tic_folio: nextFolio(),
			tic_titulo: "Corrección en bloqueo de inscripciones por adeudo vencido",
			tic_descripcion:
				"El sistema mantenía bloqueados a alumnos que ya habían realizado el pago de regularización con comprobante validado.",
			tic_fksistema: 2, // SIA-ALUMNOS
			tic_fkarea: 4, // Servicios Escolares
			tic_fkusuario: uCarlos,
			tic_fkprioridad: prioMap.get("CRITICA")!,
			tic_fksolicitud: solMap.get("ERROR")!,
			tic_fkfase: faseMap.get("REGISTRADO")!,
			tic_fkconstancia: constanciaNoAplica.con_id,
		},
	});

	const asiDateE = new Date(Date.now() - 60 * 3600 * 1000);
	await prisma.asignacion.create({
		data: {
			asi_fkticket: ticketE.tic_id,
			asi_fkusuario: uMariana,
			asi_fkestado: 1,
			asi_fkusuario_asigna: uCarlos,
			asi_principal: true,
			asi_fecha: asiDateE,
			asi_fin: null,
		},
	});

	const ateDateE = new Date(Date.now() - 58 * 3600 * 1000);
	const atencionE = await prisma.atencion.create({
		data: {
			ate_fkticket: ticketE.tic_id,
			ate_ciclo: 1,
			ate_inicio: ateDateE,
			ate_diagnostico:
				"El flag 'adeudo_pendiente' no se actualizaba automáticamente al registrarse el recibo de caja.",
			ate_solucion:
				"Se implementó un trigger y webhook sincrónico con la pasarela de pagos.",
			ate_cambios: "Lógica de actualización de estatus de cuenta corriente",
			ate_modulos: "Módulo Financiero Escolar",
			ate_datos: "Tabla alumnos_cuenta",
			ate_comentarios: "Validado satisfactoriamente con 150 expedientes",
		},
	});

	await prisma.intervencion.create({
		data: {
			int_fkatencion: atencionE.ate_id,
			int_fkusuario: uMariana,
			int_descripcion:
				"Sincronización de estados y pruebas con cuentas de prueba",
			int_minutos: 110,
			int_interno: false,
			int_fecha: new Date(Date.now() - 50 * 3600 * 1000),
		},
	});

	await prisma.evidencia.create({
		data: {
			evi_fkticket: ticketE.tic_id,
			evi_fkatencion: atencionE.ate_id,
			evi_fkclase: claseMap.get("EVIDENCIA_FINAL")!,
			evi_fkusuario: uMariana,
			evi_nombre: "validacion_desbloqueo_alumnos.png",
			evi_ruta: "/uploads/tickets/evidencia_sia_adeudos.png",
			evi_formato: "png",
			evi_tamano: 320000,
			evi_descripcion: "Prueba visual de desbloqueo exitoso",
			evi_fecha: new Date(Date.now() - 45 * 3600 * 1000),
		},
	});

	const terminoDateE = new Date(Date.now() - 40 * 3600 * 1000);
	const terminoE = await prisma.termino.create({
		data: {
			ter_fkatencion: atencionE.ate_id,
			ter_fkusuario: uMariana,
			ter_fecha: terminoDateE,
		},
	});

	const evaDateE = new Date(Date.now() - 35 * 3600 * 1000);
	await prisma.evaluacion.create({
		data: {
			eva_fkticket: ticketE.tic_id,
			eva_fkatencion: atencionE.ate_id,
			eva_fkusuario: uCarlos,
			eva_calificacion: 5,
			eva_confirmacion: true,
			eva_conformidad:
				"Excelente resolución, se desbloquearon todos los alumnos y pudieron inscribirse a tiempo.",
			eva_fecha: evaDateE,
		},
	});

	const cieDateE = new Date(Date.now() - 34 * 3600 * 1000);
	await prisma.cierre.create({
		data: {
			cie_fkticket: ticketE.tic_id,
			cie_fkatencion: atencionE.ate_id,
			cie_fkusuario: uCarlos,
			cie_comentario: "Solución probada y confirmada en producción.",
			cie_fecha: cieDateE,
		},
	});

	await prisma.ticket.update({
		where: { tic_id: ticketE.tic_id },
		data: { tic_fkfase: faseMap.get("CERRADO_POR_RESPONSABLE")! },
	});

	await prisma.transicion.create({
		data: {
			tra_fkticket: ticketE.tic_id,
			tra_fkfase_origen: faseMap.get("RESUELTO_POR_DESARROLLO")!,
			tra_fkfase_destino: faseMap.get("CERRADO_POR_RESPONSABLE")!,
			tra_fkusuario: uCarlos,
			tra_comentario: "Ticket cerrado y calificado con 5 estrellas",
		},
	});
	console.log(
		`   📌 [CERRADO]    ${ticketE.tic_folio}: "${ticketE.tic_titulo}"`,
	);

	// ----------------------------------------------------------------------------------
	// Ticket F: CERRADO_POR_RESPONSABLE (SIA-ALUMNOS, evaluado con 4 estrellas)
	// ----------------------------------------------------------------------------------
	const ticketF = await prisma.ticket.create({
		data: {
			tic_folio: nextFolio(),
			tic_titulo: "Ajuste en formato de impresión de constancia de estudios",
			tic_descripcion:
				"Alineación del sello digital institucional y código QR de validación en constancia con promedio.",
			tic_fksistema: 2, // SIA-ALUMNOS
			tic_fkarea: 4, // Servicios Escolares
			tic_fkusuario: uCarlos,
			tic_fkprioridad: prioMap.get("BAJA")!,
			tic_fksolicitud: solMap.get("MEJORA")!,
			tic_fkfase: faseMap.get("REGISTRADO")!,
			tic_fkconstancia: constanciaNoAplica.con_id,
		},
	});

	const asiDateF = new Date(Date.now() - 70 * 3600 * 1000);
	await prisma.asignacion.create({
		data: {
			asi_fkticket: ticketF.tic_id,
			asi_fkusuario: uAlejandro,
			asi_fkestado: 1,
			asi_fkusuario_asigna: uCarlos,
			asi_principal: true,
			asi_fecha: asiDateF,
			asi_fin: null,
		},
	});

	const ateDateF = new Date(Date.now() - 68 * 3600 * 1000);
	const atencionF = await prisma.atencion.create({
		data: {
			ate_fkticket: ticketF.tic_id,
			ate_ciclo: 1,
			ate_inicio: ateDateF,
			ate_diagnostico:
				"El margen inferior del CSS imprimible desfasaba el QR a una segunda hoja.",
			ate_solucion:
				"Se recalculó el layout de impresión a 1 sola página con membrete oficial.",
			ate_cambios: "Plantilla HTML/CSS de constancia de estudios",
			ate_modulos: "Módulo de Certificación Escolar",
			ate_datos: "Sin cambios en esquema",
			ate_comentarios: "Aprobado por el departamento de titulación",
		},
	});

	await prisma.intervencion.create({
		data: {
			int_fkatencion: atencionF.ate_id,
			int_fkusuario: uAlejandro,
			int_descripcion: "Ajustes de maquetación y generación de muestras PDF",
			int_minutos: 45,
			int_interno: false,
			int_fecha: new Date(Date.now() - 60 * 3600 * 1000),
		},
	});

	await prisma.evidencia.create({
		data: {
			evi_fkticket: ticketF.tic_id,
			evi_fkatencion: atencionF.ate_id,
			evi_fkclase: claseMap.get("EVIDENCIA_FINAL")!,
			evi_fkusuario: uAlejandro,
			evi_nombre: "muestra_constancia_qr_validada.pdf",
			evi_ruta: "/uploads/tickets/muestra_constancia.pdf",
			evi_formato: "pdf",
			evi_tamano: 189000,
			evi_descripcion: "Constancia con QR centrado",
			evi_fecha: new Date(Date.now() - 55 * 3600 * 1000),
		},
	});

	const terminoDateF = new Date(Date.now() - 50 * 3600 * 1000);
	const terminoF = await prisma.termino.create({
		data: {
			ter_fkatencion: atencionF.ate_id,
			ter_fkusuario: uAlejandro,
			ter_fecha: terminoDateF,
		},
	});

	const evaDateF = new Date(Date.now() - 45 * 3600 * 1000);
	await prisma.evaluacion.create({
		data: {
			eva_fkticket: ticketF.tic_id,
			eva_fkatencion: atencionF.ate_id,
			eva_fkusuario: uCarlos,
			eva_calificacion: 4,
			eva_confirmacion: true,
			eva_conformidad: "Formato corregido correctamente.",
			eva_fecha: evaDateF,
		},
	});

	const cieDateF = new Date(Date.now() - 44 * 3600 * 1000);
	await prisma.cierre.create({
		data: {
			cie_fkticket: ticketF.tic_id,
			cie_fkatencion: atencionF.ate_id,
			cie_fkusuario: uCarlos,
			cie_comentario: "Cerrado conforme a solicitud.",
			cie_fecha: cieDateF,
		},
	});

	await prisma.ticket.update({
		where: { tic_id: ticketF.tic_id },
		data: { tic_fkfase: faseMap.get("CERRADO_POR_RESPONSABLE")! },
	});

	await prisma.transicion.create({
		data: {
			tra_fkticket: ticketF.tic_id,
			tra_fkfase_origen: faseMap.get("RESUELTO_POR_DESARROLLO")!,
			tra_fkfase_destino: faseMap.get("CERRADO_POR_RESPONSABLE")!,
			tra_fkusuario: uCarlos,
			tra_comentario: "Cierre exitoso por responsable",
		},
	});
	console.log(
		`   📌 [CERRADO]    ${ticketF.tic_folio}: "${ticketF.tic_titulo}"`,
	);

	// 6. Generación de Acta Semanal para SIA-ALUMNOS
	console.log(
		"\n📋 5. Generando Acta Semanal para Sistema Integral de Alumnos...",
	);

	const uPatricia = userMap.get("patricia.solis@sisat.local")!;
	const actaInicio = new Date("2026-09-14T00:00:00.000Z");
	const actaFin = new Date("2026-09-20T00:00:00.000Z");

	const countActas = (await prisma.acta.count()) + 1;
	const actaFolio = `ACT-2026-${String(countActas).padStart(4, "0")}`;

	const acta = await prisma.acta.create({
		data: {
			act_folio: actaFolio,
			act_fksistema: 2, // SIA-ALUMNOS
			act_fkarea: 4, // Servicios Escolares
			act_fkusuario: uPatricia, // Lic. Patricia Solís (Jefa de Área de Servicios Escolares)
			act_fksituacion: sitMap.get("GENERADA")!,
			act_sistema: "Sistema Integral de Alumnos (SIA)",
			act_area: "Servicios Escolares",
			act_firmante: "Lic. Patricia Solís Valenzuela",
			act_inicio: actaInicio,
			act_fin: actaFin,
			act_observacion:
				"Acta ordinaria de entregables de soporte técnico y mantenimiento correctivo correspondiente a la semana del 14 al 20 de septiembre.",
		},
	});

	// Inclusiones de tickets cerrados en este ciclo
	await prisma.inclusion.create({
		data: {
			inc_fkacta: acta.act_id,
			inc_fkticket: ticketE.tic_id,
			inc_fkatencion: atencionE.ate_id,
			inc_inicio: atencionE.ate_inicio,
			inc_fin: terminoE.ter_fecha,
			inc_responsable: "Carlos Mendoza Silva",
			inc_desarrolladores: JSON.stringify(["Mariana Ríos Domínguez"]),
			inc_evidencias: JSON.stringify(["validacion_desbloqueo_alumnos.png"]),
			inc_problema: ticketE.tic_descripcion,
			inc_solucion: atencionE.ate_solucion!,
			inc_calificacion: 5,
		},
	});

	await prisma.inclusion.create({
		data: {
			inc_fkacta: acta.act_id,
			inc_fkticket: ticketF.tic_id,
			inc_fkatencion: atencionF.ate_id,
			inc_inicio: atencionF.ate_inicio,
			inc_fin: terminoF.ter_fecha,
			inc_responsable: "Carlos Mendoza Silva",
			inc_desarrolladores: JSON.stringify(["Alejandro Torres Vega"]),
			inc_evidencias: JSON.stringify(["muestra_constancia_qr_validada.pdf"]),
			inc_problema: ticketF.tic_descripcion,
			inc_solucion: atencionF.ate_solucion!,
			inc_calificacion: 4,
		},
	});

	// Subir archivo escaneado de acta firmada y actualizar situación a CARGADA
	await prisma.archivo.create({
		data: {
			arc_fkacta: acta.act_id,
			arc_fkclase: claseMap.get("ACTA_FIRMADA")!,
			arc_fkusuario: uPatricia,
			arc_nombre: `acta_semanal_firmada_${acta.act_folio.toLowerCase()}.pdf`,
			arc_ruta: `/uploads/actas/${acta.act_folio.toLowerCase()}_firmada.pdf`,
			arc_formato: "pdf",
			arc_tamano: 845200,
			arc_observacion: "Documento oficial con rúbrica de entrega-recepción.",
		},
	});

	await prisma.acta.update({
		where: { act_id: acta.act_id },
		data: { act_fksituacion: sitMap.get("CARGADA")! },
	});

	console.log(
		`   ✅ Acta Semanal ${acta.act_folio} creada con 2 tickets incluidos y marcada como CARGADA.`,
	);

	// 7. Resumen de Cuentas y Accesos
	console.log("\n=========================================================");
	console.log("🎉 DATOS DE PRUEBA GENERADOS SATISFACTORIAMENTE");
	console.log("=========================================================");
	console.log("\n🔑 CREDENCIALES DE ACCESO LISTAS PARA PRUEBAS:");
	console.log(
		"-------------------------------------------------------------------------------",
	);
	console.log(
		" Rol                     | Email                            | Contraseña      ",
	);
	console.log(
		"-------------------------------------------------------------------------------",
	);
	console.log(
		" Administrador           | admin@sisat.local                | Admin123456!    ",
	);
	console.log(
		" Responsable (Escolares) | carlos.mendoza@sisat.local       | Password123!    ",
	);
	console.log(
		" Responsable (Finanzas)  | laura.garcia@sisat.local         | Password123!    ",
	);
	console.log(
		" Desarrollador Senior    | alejandro.torres@sisat.local     | Password123!    ",
	);
	console.log(
		" Desarrolladora Backend  | mariana.rios@sisat.local         | Password123!    ",
	);
	console.log(
		" Jefe de Área (TI)       | roberto.navarro@sisat.local      | Password123!    ",
	);
	console.log(
		" Jefa de Área (Escolar)  | patricia.solis@sisat.local       | Password123!    ",
	);
	console.log(
		"-------------------------------------------------------------------------------",
	);
	console.log("\n📊 ESTADO DE TICKETS CREADOS:");
	console.log(
		` - REGISTRADO:              ${ticketA.tic_folio} (${ticketA.tic_titulo})`,
	);
	console.log(
		` - ASIGNADO:                ${ticketB.tic_folio} (${ticketB.tic_titulo})`,
	);
	console.log(
		` - EN_PROCESO:              ${ticketC.tic_folio} (${ticketC.tic_titulo})`,
	);
	console.log(
		` - RESUELTO_POR_DESARROLLO: ${ticketD.tic_folio} (${ticketD.tic_titulo})`,
	);
	console.log(
		` - CERRADO_POR_RESPONSABLE: ${ticketE.tic_folio} (${ticketE.tic_titulo})`,
	);
	console.log(
		` - CERRADO_POR_RESPONSABLE: ${ticketF.tic_folio} (${ticketF.tic_titulo})`,
	);
	console.log(`\n📋 ACTAS SEMANALES:`);
	console.log(
		` - ${acta.act_folio} (Sistema: SIA-ALUMNOS, Situación: CARGADA con archivo firmado)`,
	);
	console.log("=========================================================\n");
}

main()
	.then(async () => {
		await prisma.$disconnect();
		process.exit(0);
	})
	.catch(async (e) => {
		console.error("\n❌ ERROR POBLANDO DATOS DE PRUEBA:", e);
		await prisma.$disconnect();
		process.exit(1);
	});
