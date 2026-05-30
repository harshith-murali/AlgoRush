import React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { getClerkUserRole } from "@/lib/roles";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userRole = await getClerkUserRole();

  return <AppLayout userRole={userRole}>{children}</AppLayout>;
}
