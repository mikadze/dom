"use client";

import { useEffect, useRef, useCallback } from "react";
import { ExpiredMessageOut, Seat, Session } from "@repo/shared";

export function useWebSocket(
  url: string,
  sessionId: string,
  setSession: (
    session: Session | null | ((prev: Session | null) => Session | null)
  ) => void
) {
  const wsRef = useRef<WebSocket | null>(null);

  const handleWsMessage = useCallback(
    (event: MessageEvent) => {
      const message: ExpiredMessageOut = JSON.parse(event.data);
      if (message.type === "expired_bookings") {
        // @ts-expect-error smth
        const seats = message.payload[sessionId];

        if (seats) {
          setSession((prev) => {
            if (!prev) return prev;

            const updatedSeats = prev.seats.map((seat) => {
              if (
                seats.some(
                  (s: Seat) =>
                    s.rowNumber === seat.rowNumber &&
                    s.seatNumber === seat.seatNumber
                )
              ) {
                return { ...seat, status: "available" as Seat["status"] };
              }
              return seat;
            });
            return { ...prev, seats: updatedSeats };
          });
        }
      }
    },
    [sessionId, setSession]
  );

  useEffect(() => {
    if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
      wsRef.current = new WebSocket("ws://localhost:8000");

      wsRef.current.onmessage = handleWsMessage;
      wsRef.current.onerror = (error) =>
        console.error("WebSocket error:", error);
      wsRef.current.onclose = () => console.log("WebSocket closed");
    }

    return () => {
      if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
        wsRef.current.close();
      }
    };
  }, [handleWsMessage]);

  return wsRef;
}
