import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/core/api/client";
import { usersApi } from "../api/usersApi";
import type { CreateUserInput, UpdateUserInput } from "../api/usersApi";

export function useUserMutations() {
	const queryClient = useQueryClient();

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["users"] });
		queryClient.invalidateQueries({ queryKey: ["allUsersForAreas"] });
		queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
	};

	const createUserMutation = useMutation({
		mutationFn: (data: CreateUserInput) => usersApi.createUser(data),
		onSuccess: () => {
			toast.success("Usuario registrado exitosamente");
			invalidate();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const updateUserMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateUserInput }) =>
			usersApi.updateUser(id, data),
		onSuccess: () => {
			toast.success("Usuario actualizado correctamente");
			invalidate();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const deleteUserMutation = useMutation({
		mutationFn: (id: number) => usersApi.deleteUser(id),
		onSuccess: () => {
			toast.success("Usuario eliminado del sistema");
			invalidate();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	return {
		createUserMutation,
		updateUserMutation,
		deleteUserMutation,
	};
}
