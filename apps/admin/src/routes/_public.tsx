import { createFileRoute, Outlet } from "@tanstack/react-router";

import DefaultLayout from "@/components/layouts/DefaultLayout";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
}
