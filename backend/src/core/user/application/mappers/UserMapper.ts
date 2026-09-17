import type { User } from "../../domain/User";
import type { UserDto } from "../dtos/UserDto";

export class UserMapper {
	public static toDto(user: User): UserDto {
		return {
			id: user.getId(),
			name: user.getName(),
			apellido: user.getApellido(),
			email: user.getEmail(),
			isActive: user.getIsActive(),
			role: user.getRole(),
			roles: user.getRoles(),
			areaId: user.getAreaId(),
			puesto: user.getPuesto(),
		};
	}
}
