import { apiClient } from "@/core/api/client";
import type { PaginatedResponse } from "@/core/api/types";
import type { User } from "@/core/auth/types";

export interface GetUsersParams {
	page?: number;
	limit?: number;
	email?: string;
}

export interface CreateUserInput {
	email: string;
	name?: string;
	apellido?: string;
	password: string;
	areaId?: number;
	puesto?: string;
	role?: string;
	roles?: string[];
}

export interface UpdateUserInput {
	email?: string;
	name?: string;
	apellido?: string;
	password?: string;
	areaId?: number;
	puesto?: string;
	role?: string;
	roles?: string[];
	isActive?: boolean;
}

export const usersApi = {
	async getUsers(
		params: GetUsersParams = {},
	): Promise<PaginatedResponse<User>> {
		const response = await apiClient.get<PaginatedResponse<User>>("/users", {
			params,
		});
		return response.data;
	},

	async getUserById(id: number): Promise<User> {
		const response = await apiClient.get<User>(`/users/${id}`);
		return response.data;
	},

	async createUser(data: CreateUserInput): Promise<User> {
		const response = await apiClient.post<User>("/users", data);
		return response.data;
	},

	async updateUser(id: number, data: UpdateUserInput): Promise<User> {
		const response = await apiClient.put<User>(`/users/${id}`, data);
		return response.data;
	},

	async deleteUser(id: number): Promise<void> {
		await apiClient.delete(`/users/${id}`);
	},
};
