"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800">404 - Page Not Found</h1>
      {!localStorage.getItem("jwt") && (
        <p className="mt-4 text-gray-600">
          Please{" "}
          <a href="/signup" className="text-blue-500">
            sign up
          </a>{" "}
          or{" "}
          <a href="/login" className="text-blue-500">
            log in
          </a>
          .
        </p>
      )}
    </div>
  );
}
