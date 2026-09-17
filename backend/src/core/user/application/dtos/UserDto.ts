export interface UserDto {
	id: number;
	name: string;
	apellido?: string;
	email: string;
	isActive: boolean;
	role: string;
	roles?: string[];
	areaId?: number;
	puesto?: string;
}
