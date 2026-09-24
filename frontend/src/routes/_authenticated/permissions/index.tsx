import { createFileRoute } from "@tanstack/react-router";
import { PermissionsPage } from "@/modules/users/pages/PermissionsPage";

export const Route = createFileRoute("/_authenticated/permissions/")({
	component: PermissionsPage,
});
