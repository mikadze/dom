import { Container } from "typedi";
import LoggerInstance from "./logger";
import AuthService, {
  DITOKEN as authServiceToken,
} from "@/modules/auth/services/auth";
import {
  UserRepository,
  DITOKEN as userRepoToken,
} from "@/modules/auth/repos/user.repo";
import {
  MovieService,
  DITOKEN as movieServiceToken,
} from "@/modules/movie/services/movie.service";
import {
  SessionService,
  DITOKEN as sessionServiceToken,
} from "@/modules/session/services/session.service";
import {
  MovieRepository,
  DITOKEN as movieRepoToken,
} from "@/modules/movie/repos/movie.repo";
import {
  SessionRepository,
  DITOKEN as sessionRepoToken,
} from "@/modules/session/repos/session.repo";
import {
  BookingService,
  DITOKEN as bookingServiceToken,
} from "@/modules/booking/services/booking.service";
import {
  BookingRepository,
  DITOKEN as bookingRepoToken,
} from "@/modules/booking/repos/booking.repo";
import {
  BookingSeatRepository,
  DITOKEN as bookingSeatToken,
} from "@/modules/booking/repos/booking-seat.repo";

const services = [
  { service: AuthService, token: authServiceToken },
  { service: MovieService, token: movieServiceToken },
  { service: SessionService, token: sessionServiceToken },
  { service: BookingService, token: bookingServiceToken },
];
const repos = [
  { service: UserRepository, token: userRepoToken },
  { service: MovieRepository, token: movieRepoToken },
  { service: SessionRepository, token: sessionRepoToken },
  { service: BookingRepository, token: bookingRepoToken },
  { service: BookingSeatRepository, token: bookingSeatToken },
];

const allDi = [...services, ...repos];

export default () => {
  try {
    for (const service of allDi) {
      const Class = service.service;
      Container.set(service.token, Class);
    }
  } catch (e) {
    LoggerInstance.error("🔥 Error on dependency injector loader: %o", e);
    throw e;
  }
};
