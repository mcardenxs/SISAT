import type { Pagination } from "@/core/shared/domain/Pagination";
import type { User } from "../User";
import type { UserFilters } from "./UserFilters";

export interface UserRepository {
	find: (filters: UserFilters) => Promise<Pagination<User>>;
	findById: (id: number) => Promise<User | null>;
	findByEmail: (email: string) => Promise<User | null>;

	create: (data: User) => Promise<User>;
	update: (data: User) => Promise<User>;

	delete: (id: number) => Promise<void>;
}
