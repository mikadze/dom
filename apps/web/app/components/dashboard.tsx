"use client";

import { useAuth } from "../hooks/useAuth";
import { useSessions } from "../hooks/useSessions";
import SessionCard from "./session-card";

export default function Dashboard() {
  const { isAuthenticated, handleLogout } = useAuth("/signup");
  const { sessions, loading, error } = useSessions();

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <h2 className="text-2xl font-semibold mb-4">
          Available Movie Sessions
        </h2>

        {loading && <p>Loading sessions...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && sessions.length === 0 && (
          <p>No sessions available.</p>
        )}

        {!loading && !error && sessions.length > 0 && (
          <div className="grid gap-4">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
