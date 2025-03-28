// packages/client/app/hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth(redirectPath: string = "/signup") {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Only runs on the client, after hydration
    const token = localStorage.getItem("jwt");
    setIsAuthenticated(!!token);

    if (!token) {
      router.push(redirectPath);
    }
  }, [router, redirectPath]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    router.push(redirectPath);
  };

  return { isAuthenticated, handleLogout };
}
