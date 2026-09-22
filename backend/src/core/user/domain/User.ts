import { Entity } from "@/core/shared/domain/Entity";
import { Email } from "./value-objects/Email";
import { Role } from "./value-objects/Role";
import { EntityId } from "@/core/shared/domain/EntityId";
import { CreateUserEvent } from "./event/CreateUserEvent";

export class User extends Entity {
	private name: string;
	private apellido: string;
	private email: Email;
	private passwordHash: string;
	private isActive: boolean;
	private role: Role;
	private roles: string[];
	private areaId: number;
	private puesto: string;

	// El constructor es privado para forzar el uso del Factory Method
	private constructor(
		id: EntityId,
		name: string,
		apellido: string,
		email: Email,
		passwordHash: string,
		isActive: boolean,
		role: Role,
		roles: string[] = [],
		areaId: number = 1,
		puesto: string = "",
	) {
		super(id);
		this.name = name;
		this.apellido = apellido;
		this.email = email;
		this.passwordHash = passwordHash;
		this.isActive = isActive;
		this.role = role;
		this.roles = roles.length > 0 ? roles : [role.value];
		this.areaId = areaId;
		this.puesto = puesto;
	}

	// Crear un usuario NUEVO desde la interfaz de usuario
	public static create(
		name: string,
		emailStr: string,
		passwordHash: string,
		roleStr: string = "CONSULTA",
		apellido: string = "",
		areaId: number = 1,
		puesto: string = "",
		roles: string[] = [],
	): User {
		const emailVO = new Email(emailStr);
		const roleVO = new Role(roleStr);
		const effectiveRoles =
			roles.length > 0
				? roles
				: [roleVO.value];

		// Aquí el ID es undefined porque es nuevo
		const user = new User(
			new EntityId(),
			name,
			apellido,
			emailVO,
			passwordHash,
			true,
			roleVO,
			effectiveRoles,
			areaId,
			puesto,
		);

		return user;
	}

	public updateProfile(data: {
		name?: string;
		apellido?: string;
		emailStr?: string;
		areaId?: number;
		puesto?: string;
		roleStr?: string;
		roles?: string[];
		isActive?: boolean;
		passwordHash?: string;
	}): void {
		if (data.name !== undefined) this.name = data.name;
		if (data.apellido !== undefined) this.apellido = data.apellido;
		if (data.emailStr !== undefined) this.email = new Email(data.emailStr);
		if (data.areaId !== undefined) this.areaId = data.areaId;
		if (data.puesto !== undefined) this.puesto = data.puesto;
		if (data.roleStr !== undefined) {
			this.role = new Role(data.roleStr);
			if (!this.roles.includes(data.roleStr)) {
				this.roles = [data.roleStr, ...this.roles];
			}
		}
		if (data.roles !== undefined && data.roles.length > 0) {
			this.roles = data.roles;
			this.role = new Role(data.roles[0]);
		}
		if (data.isActive !== undefined) this.isActive = data.isActive;
		if (data.passwordHash !== undefined) this.passwordHash = data.passwordHash;
	}

	// Reconstruir un usuario EXISTENTE desde la Base de Datos (Usado por el Mapper)
	public static reconstitute(
		name: string,
		emailStr: string,
		passwordHash: string,
		isActive: boolean,
		id: number,
		roleStr: string,
		apellido: string = "",
		areaId: number = 1,
		puesto: string = "",
		roles: string[] = [],
	): User {
		const entityId = new EntityId(id);
		const emailVO = new Email(emailStr);
		const roleVO = new Role(roleStr);

		return new User(
			entityId,
			name,
			apellido,
			emailVO,
			passwordHash,
			isActive,
			roleVO,
			roles.length > 0 ? roles : [roleVO.value],
			areaId,
			puesto,
		);
	}

	getName() {
		return this.name;
	}
	getApellido() {
		return this.apellido;
	}
	getEmail() {
		return this.email.value;
	}
	getPasswordHash() {
		return this.passwordHash;
	}
	getIsActive() {
		return this.isActive;
	}
	getRole() {
		return this.role.value;
	}
	getRoles() {
		return this.roles;
	}
	getAreaId() {
		return this.areaId;
	}
	getPuesto() {
		return this.puesto;
	}

	// Comportamiento de dominio
	public deactivate(): void {
		this.isActive = false;
	}

	public addCreateEvent() {
		this.addDomainEvent(
			new CreateUserEvent({ id: this.getId(), email: this.email.value }),
		);
	}
}
