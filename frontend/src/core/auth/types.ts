export interface User {
	id: number;
	name: string;
	apellido?: string;
	email: string;
	role: string;
	roles?: string[];
	areaId?: number;
	puesto?: string;
	isActive: boolean;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

export interface AuthResponse {
	accessToken: string;
	refreshToken: string;
	user: User;
}

export interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	login: (payload: AuthResponse) => void;
	setTokens: (tokens: AuthTokens) => void;
	logout: () => void;
	updateUser: (userData: Partial<User>) => void;
}
