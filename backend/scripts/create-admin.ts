import { prisma } from "../src/core/config/prisma";
import bcrypt from "bcrypt";

async function main() {
	console.log("🛡️  Crear Nuevo Usuario Administrador\n");

	const args = process.argv.slice(2);
	const email = args[0] || prompt("Email del administrador: ");
	const name = args[1] || prompt("Nombre completo: ");
	const password = args[2] || prompt("Contraseña: ");

	if (!email || !name || !password) {
		console.log("❌ Error: Todos los campos son obligatorios.");
		process.exit(1);
	}

	try {
		// 1. Obtener rol ADMINISTRADOR de SISAT
		let role = await prisma.rol.findFirst({
			where: { rol_codigo: "ADMINISTRADOR" },
		});
		if (!role) {
			console.log("⚙️  El rol ADMINISTRADOR no existe. Creándolo...");
			role = await prisma.rol.create({
				data: {
					rol_codigo: "ADMINISTRADOR",
					rol_nombre: "Administrador",
				},
			});
		}

		// 2. Obtener área base
		let area = await prisma.area.findFirst();
		if (!area) {
			area = await prisma.area.create({
				data: {
					are_nombre: "Tecnologías de la Información",
					are_fkestado: 1,
				},
			});
		}

		// 3. Verificar si el usuario ya existe
		const existingUser = await prisma.usuario.findUnique({
			where: { usu_correo: email },
		});
		if (existingUser) {
			console.log("❌ Error: Ya existe un usuario con ese email.");
			process.exit(1);
		}

		// 4. Hashear la contraseña
		const passwordHash = await bcrypt.hash(password, 10);

		// 5. Crear el usuario y su perfil
		const user = await prisma.usuario.create({
			data: {
				usu_correo: email,
				usu_nombre: name,
				usu_apellido: "Admin",
				usu_contrasena: passwordHash,
				usu_fkarea: area.are_id,
				usu_fkestado: 1,
				usu_puesto: "Administrador del Sistema",
				perfil: {
					create: {
						per_fkrol: role.rol_id,
					},
				},
			},
		});

		console.log(`\n✅ ¡Éxito! Usuario administrador creado correctamente.`);
		console.log(`   Email: ${user.usu_correo}`);
		console.log(`   Rol:   ADMINISTRADOR`);
	} catch (error) {
		console.error("❌ Error inesperado creando administrador:", error);
		process.exit(1);
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
		process.exit(0);
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
