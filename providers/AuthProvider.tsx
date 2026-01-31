"use client";

import { useAuthStore } from "@/lib/store/auth.store";
import { useEffect } from "react";

export default function AuthProvider({
  children,
  auth,
}: {
  children: React.ReactNode;
  auth: any;
}) {
  const { setAuth } = useAuthStore();

  useEffect(() => {
    if (auth) {
      setAuth(auth);
    }
  }, [auth, setAuth]);

  return <>{children}</>;
}
