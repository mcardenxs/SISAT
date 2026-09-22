export interface CreateUserDto {
	email: string;
	name?: string;
	password: string;
	apellido?: string;
	areaId?: number;
	puesto?: string;
	role?: string;
	roles?: string[];
}
