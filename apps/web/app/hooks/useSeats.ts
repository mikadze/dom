// packages/client/app/hooks/useSeatManagement.ts
"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { confirmBooking, reserveSeats, getSeatMap } from "../lib/api";
import { Seat, ReservationResponse, Session } from "@repo/shared";

export function useSeatManagement(
  sessionId: string | string[] | undefined,
  setSession: Dispatch<SetStateAction<Session | null>>
) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [reservation, setReservation] = useState<ReservationResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const toggleSeatSelection = (seat: Seat) => {
    // @ts-expect-error smth
    if (seat.status === "reserved" || seat.status === "own_reservation") return;

    const isSelected = selectedSeats.some(
      (s) => s.rowNumber === seat.rowNumber && s.seatNumber === seat.seatNumber
    );
    if (isSelected) {
      setSelectedSeats(
        selectedSeats.filter(
          (s) =>
            !(
              s.rowNumber === seat.rowNumber && s.seatNumber === seat.seatNumber
            )
        )
      );
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }

    setSession((prev: Session | null) => {
      if (!prev) return prev;
      else
        return {
          ...prev,
          seats: prev.seats.map((s: Seat) =>
            s.rowNumber === seat.rowNumber && s.seatNumber === seat.seatNumber
              ? { ...s, status: isSelected ? "available" : "selected" }
              : s
          ),
        };
    });
  };

  const handleReserve = async (session: Session | null) => {
    if (!session || selectedSeats.length === 0) return;

    setLoading(true);

    try {
      const response = await reserveSeats(
        session.id,
        selectedSeats.map((seat) => ({
          rowNumber: seat.rowNumber,
          seatNumber: seat.seatNumber,
        }))
      );
      setReservation(response);

      setSession((prev: Session | null) => {
        if (!prev) return null;

        return {
          ...prev,
          seats: prev.seats.map((seat: Seat) =>
            response.booking.bookingSeats.some(
              (bs: Seat) =>
                bs.rowNumber === seat.rowNumber &&
                bs.seatNumber === seat.seatNumber
            )
              ? ({ ...seat, status: "own_reservation" } as unknown as Seat)
              : seat
          ),
        };
      });

      setSelectedSeats(response.booking.bookingSeats);
    } catch (err) {
      setError("Reservation failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (
    setSession: (session: Session | null) => void
  ) => {
    if (!reservation?.reservationToken || !sessionId) return;

    setLoading(true);
    try {
      await confirmBooking(reservation.reservationToken);
      const data = await getSeatMap(sessionId as string);
      setSession({ ...data.session, seats: data.seatMap });
      setSelectedSeats([]);
      setReservation(null);
      setTimeLeft(null);
    } catch (err) {
      setError("Confirmation failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!reservation?.expiresAt) return;

    const expiryDate = new Date(reservation.expiresAt).getTime();
    const updateTimer = () => {
      const now = new Date().getTime();
      const remaining = Math.max(0, expiryDate - now);
      setTimeLeft(remaining / 1000);
      if (remaining === 0) {
        setReservation(null);
        setSession((prev: Session | null) => {
          if (!prev) return null;

          return {
            ...prev,
            seats: prev.seats.map((seat) =>
              reservation.booking.bookingSeats.some(
                (bs) =>
                  bs.rowNumber === seat.rowNumber &&
                  bs.seatNumber === seat.seatNumber
              )
                ? { ...seat, status: "available" }
                : seat
            ),
          };
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [reservation, setSession]);

  return {
    selectedSeats,
    reservation,
    loading,
    error,
    timeLeft,
    toggleSeatSelection,
    handleReserve,
    handleConfirm,
  };
}
