import { Hall } from "./hall";
import { Movie } from "./movie";
import { Session } from "./session";
import { User } from "./user";
import { Booking } from "./booking";
import { BookingSeat } from "./booking-seat";

export * from "./user";
export * from "./movie";
export * from "./hall";
export * from "./session";
export * from "./booking";
export * from "./booking-seat";

export const entities = [User, Movie, Hall, Session, Booking, BookingSeat];
