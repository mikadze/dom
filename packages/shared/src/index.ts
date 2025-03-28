export interface Movie {
  id: number;
  title: string;
  description: string;
  duration: number;
}

export interface Hall {
  id: number;
  name: string;
  rows: number;
  seatsPerRow: number;
}

export interface Seat {
  rowNumber: number;
  seatNumber: number;
  status: "available" | "reserved" | "selected";
}

export interface BookingSeat {
  bookingId: number;
  sessionId: number;
  rowNumber: number;
  seatNumber: number;
  deletedAt: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Booking {
  id: number;
  sessionId: number;
  status: "reserved" | "confirmed" | "expired";
  createdAt: string;
  expiresAt: string;
  confirmedAt: string | null;
  reservationToken: string;
  bookingSeats: BookingSeat[];
  reservedBy: User;
  userId: number;
}

export interface ReservationResponse {
  booking: Booking;
  reservationToken: string;
  expiresAt: string;
}

export interface Session {
  id: number;
  movie: Movie;
  hall: Hall;
  startTime: string;
  endTime: string;
  seats: Seat[];
}

export interface SeatsUpdatedMessage {
  type: "seats:updated";
  payload: {
    sessionId: number;
    seats: { row: number; seat: number }[];
  };
}

export interface ExpiredMessageOut {
  type: "expired_bookings";
  payload: {
    [sessionId: number]: {
      rowNumber: number;
      seatNumber: number;
      status: string;
    }[];
  };
}
