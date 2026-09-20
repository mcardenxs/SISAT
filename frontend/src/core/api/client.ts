import axios, {
	type AxiosResponse,
	type InternalAxiosRequestConfig,
	isAxiosError,
} from "axios";
import { useAuthStore } from "@/core/auth/store";
import type { ApiErrorResponse } from "./types";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
	_retry?: boolean;
}

export const apiClient = axios.create({
	baseURL: "/api",
	headers: {
		"Content-Type": "application/json",
	},
});

// Request Interceptor: Inyectar token de autenticación y normalizar rutas
apiClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		// Evitar duplicación de /api cuando baseURL ya es /api
		if (config.url?.startsWith("/api/")) {
			config.url = config.url.replace(/^\/api/, "");
		}
		const token = useAuthStore.getState().accessToken;
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error: unknown) => {
		return Promise.reject(error);
	},
);

// Response Interceptor: Manejo de 401 y Refresh Token automático
apiClient.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error: unknown) => {
		if (!isAxiosError<ApiErrorResponse>(error) || !error.config) {
			return Promise.reject(error);
		}

		const originalRequest = error.config as CustomAxiosRequestConfig;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			const { refreshToken, logout, setTokens } = useAuthStore.getState();

			if (!refreshToken) {
				logout();
				return Promise.reject(error);
			}

			try {
				// Llamada directa sin interceptores para evitar bucles
				const response = await axios.post<{
					accessToken: string;
					refreshToken: string;
				}>("/api/auth/refresh", { refreshToken });

				const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
					response.data;

				setTokens({
					accessToken: newAccessToken,
					refreshToken: newRefreshToken,
				});

				if (originalRequest.headers) {
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				}

				return apiClient(originalRequest);
			} catch (refreshError) {
				logout();
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);

export function getErrorMessage(error: unknown): string {
	if (isAxiosError<ApiErrorResponse>(error)) {
		if (error.response?.data?.error) {
			return error.response.data.error;
		}
		if (error.response?.data?.message) {
			return error.response.data.message;
		}
		if (error.message) {
			return error.message;
		}
	}
	if (error instanceof Error) {
		return error.message;
	}
	return "Ha ocurrido un error inesperado";
}
