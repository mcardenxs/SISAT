export interface GetAllUsersDto {
	page: number;
	limit: number;
	email?: string;
	role?: string;
}
