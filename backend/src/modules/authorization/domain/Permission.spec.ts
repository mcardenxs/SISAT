import { describe, expect, it } from "bun:test";
import { Permission } from "./Permission";

describe("Permission", () => {
	it("debería coincidir exactamente con recurso y acción", () => {
		const perm = Permission.reconstitute(1, "tickets", "read");
		expect(perm.matches("tickets", "read")).toBe(true);
		expect(perm.matches("tickets", "create")).toBe(false);
		expect(perm.matches("users", "read")).toBe(false);
	});

	it("debería soportar comodín '*' tanto en recurso como en acción", () => {
		const adminPerm = Permission.reconstitute(2, "*", "*");
		expect(adminPerm.matches("tickets", "read")).toBe(true);
		expect(adminPerm.matches("tickets", "delete")).toBe(true);
		expect(adminPerm.matches("cualquier_recurso", "cualquier_accion")).toBe(true);

		const readAllPerm = Permission.reconstitute(3, "*", "read");
		expect(readAllPerm.matches("tickets", "read")).toBe(true);
		expect(readAllPerm.matches("tickets", "delete")).toBe(false);
	});
});
