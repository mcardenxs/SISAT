import { BaseError } from "@/core/shared/domain/error/BaseError";

export type RoleType =
	| "ADMINISTRADOR"
	| "RESPONSABLE_DE_SISTEMA"
	| "DESARROLLADOR"
	| "JEFE_DE_AREA"
	| "CONSULTA"
	| "ADMIN"
	| "USER"
	| "MOD";

const validRoles: RoleType[] = [
	"ADMINISTRADOR",
	"RESPONSABLE_DE_SISTEMA",
	"DESARROLLADOR",
	"JEFE_DE_AREA",
	"CONSULTA",
	"ADMIN",
	"USER",
	"MOD",
];

export class Role {
	public readonly value: RoleType;

	constructor(value: string) {
		if (!this.isValid(value)) {
			throw new BaseError(
				`Role '${value}' is not valid. Allowed roles are: ${validRoles.join(", ")}`,
				400,
			);
		}
		this.value = value as RoleType;
	}

	private isValid(value: string): boolean {
		return validRoles.includes(value as RoleType);
	}
}
