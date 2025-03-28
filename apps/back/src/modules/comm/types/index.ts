import { Booking } from "@/db/entities";

export const CONNECTION_EVENT = "connection";
export const MESSAGE_EVENT = "message";
export const ERROR_EVENT = "error";
export const CLOSE_EVENT = "close";

export const EXPIRED_BOOKINGS = "expired_bookings";

export interface ExpiredMessageInternal {
  type: "expired_bookings";
  payload: {
    bookings: Booking[];
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

export interface RandomMessage {
  type: "random";
  id: string;
}

export type InternalEvent = ExpiredMessageInternal;

export type WebSocketMessage = ExpiredMessageOut | RandomMessage;

export type OutgoingEventMessage = Exclude<WebSocketMessage, RandomMessage>;
