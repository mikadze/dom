"use client";

import { useParams } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useSession } from "../hooks/useSession";
import { useWebSocket } from "../hooks/useWebsocket";
import { useSeatManagement } from "../hooks/useSeats";

export default function SessionDetails() {
  const params = useParams();
  const id = params?.id;
  const { isAuthenticated } = useAuth("/signup");
  const {
    session,
    setSession,
    loading: sessionLoading,
    error: sessionError,
  } = useSession(id);
  useWebSocket("ws://localhost:8000", id as string, setSession);
  const {
    selectedSeats,
    reservation,
    loading: actionLoading,
    error: actionError,
    timeLeft,
    toggleSeatSelection,
    handleReserve,
    handleConfirm,
  } = useSeatManagement(id, setSession);

  if (!isAuthenticated) return null;
  if (sessionLoading && !session)
    return <p className="text-center text-gray-500">Loading seat map...</p>;
  if (sessionError)
    return <p className="text-center text-red-500">{sessionError}</p>;
  if (!session)
    return <p className="text-center text-gray-500">Session not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {session.movie.title}
        </h1>
        <p className="text-gray-600 mb-2">Hall: {session.hall.name}</p>
        <p className="text-gray-600 mb-6">
          Start:{" "}
          {new Date(session.startTime).toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Select Your Seats
        </h2>
        <div className="mb-6">
          {Array.from({ length: session.hall.rows }, (_, rowIdx) => (
            <div key={rowIdx} className="flex space-x-2 mb-2">
              {session.seats
                .filter((seat) => seat.rowNumber === rowIdx + 1)
                .map((seat) => (
                  <button
                    key={`${seat.rowNumber}-${seat.seatNumber}`}
                    onClick={() => toggleSeatSelection(seat)}
                    disabled={
                      seat.status === "reserved" ||
                      // @ts-expect-error smth
                      seat.status === "own_reservation"
                    }
                    className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-semibold text-white transition-colors ${
                      // @ts-expect-error smth
                      seat.status === "own_reservation"
                        ? "bg-green-600 cursor-not-allowed"
                        : seat.status === "reserved" ||
                            // @ts-expect-error smth
                            seat.status === "confirmed"
                          ? "bg-red-500 cursor-not-allowed"
                          : seat.status === "selected"
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                  >
                    {seat.seatNumber}
                  </button>
                ))}
            </div>
          ))}
        </div>

        <div className="mb-6 space-y-2">
          <p className="text-gray-700">
            Selected Seats:{" "}
            <span className="font-medium">
              {selectedSeats.length === 0
                ? "None"
                : selectedSeats
                    .map((s) => `Row ${s.rowNumber} / Seat ${s.seatNumber}`)
                    .join(", ")}
            </span>
          </p>
          {timeLeft !== null && (
            <p className="text-gray-700">
              Reservation expires in:{" "}
              <span className="font-medium">
                {Math.floor(timeLeft / 60)}:
                {String(Math.floor(timeLeft % 60)).padStart(2, "0")}
              </span>
            </p>
          )}
          {actionError && <p className="text-red-500">{actionError}</p>}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => handleReserve(session)}
            disabled={
              actionLoading ||
              selectedSeats.length === 0 ||
              reservation !== null
            }
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {actionLoading ? "Reserving..." : "Reserve"}
          </button>
          {reservation && timeLeft !== null && timeLeft > 0 && (
            <button
              onClick={() => handleConfirm(setSession)}
              disabled={actionLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {actionLoading ? "Confirming..." : "Confirm"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
