import { getAuth } from "@/lib/actions/auth.action";
import { ENUMs } from "@/lib/enums";
import AuthProvider from "@/providers/AuthProvider";
import { redirect } from "next/navigation";
import React from "react";

export default async function AiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getAuth();

  if ((auth as any).__isError) {
    redirect(`/${ENUMs.PAGES.SIGNIN}`);
  }
  return <AuthProvider auth={auth}>{children}</AuthProvider>;
}
