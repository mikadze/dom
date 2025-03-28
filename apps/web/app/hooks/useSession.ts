"use client";

import { useState, useEffect } from "react";
import { getSeatMap } from "../lib/api";
import { Session } from "@repo/shared";

export function useSession(sessionId: string | string[] | undefined) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeatMap = async () => {
      if (!sessionId) return;
      try {
        const data = await getSeatMap(sessionId as string);
        setSession({ ...data.session, seats: data.seatMap });
      } catch (err) {
        setError("Failed to load seat map.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeatMap();
  }, [sessionId]);

  return { session, setSession, loading, error };
}
