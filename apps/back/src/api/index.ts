import { Router } from "express";
import auth from "./routes/auth.routes";
import session from "./routes/session.routes";
import booking from "./routes/booking.routes";
import movies from "./routes/movies.routes";

export default () => {
  const app = Router();

  auth(app);
  session(app);
  movies(app);
  booking(app);

  return app;
};
