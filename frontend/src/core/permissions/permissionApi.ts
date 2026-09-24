import { apiClient } from "@/core/api/client";

export interface PermissionDto {
	id: number;
	resource: string;
	action: string;
}

export interface CreatePermissionInput {
	resource: string;
	action: string;
}

export interface UpdatePermissionInput {
	resource?: string;
	action?: string;
}

export const permissionApi = {
	getAll: async (): Promise<PermissionDto[]> => {
		const response = await apiClient.get<PermissionDto[]>("/permissions");
		return response.data;
	},

	getById: async (id: number): Promise<PermissionDto> => {
		const response = await apiClient.get<PermissionDto>(`/permissions/${id}`);
		return response.data;
	},

	getUserPermissions: async (userId: number): Promise<PermissionDto[]> => {
		const response = await apiClient.get<PermissionDto[]>(
			`/permissions/users/${userId}`,
		);
		return response.data;
	},

	create: async (data: CreatePermissionInput): Promise<PermissionDto> => {
		const response = await apiClient.post<PermissionDto>("/permissions", data);
		return response.data;
	},

	update: async (
		id: number,
		data: UpdatePermissionInput,
	): Promise<PermissionDto> => {
		const response = await apiClient.put<PermissionDto>(
			`/permissions/${id}`,
			data,
		);
		return response.data;
	},

	delete: async (id: number): Promise<void> => {
		await apiClient.delete(`/permissions/${id}`);
	},
};
