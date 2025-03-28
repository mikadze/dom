"use client";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const publicPaths = ["/signup", "/login"]; // Add other public paths as needed

    if (!token && !publicPaths.includes(pathname)) {
      router.push("/signup");
    }
  }, [router, pathname]);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
