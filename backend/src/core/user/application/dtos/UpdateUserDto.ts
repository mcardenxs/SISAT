export interface UpdateUserDto {
	email?: string;
	name?: string;
	apellido?: string;
	areaId?: number;
	puesto?: string;
	role?: string;
	roles?: string[];
	isActive?: boolean;
	password?: string;
}
