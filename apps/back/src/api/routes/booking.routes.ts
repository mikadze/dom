import { Router } from "express";
import { attachCurrentUser, isAuth } from "../middlewares";
import { BookingController } from "@/modules/booking/controllers/booking.controller";

const route = Router();

export default (app: Router) => {
  app.use("/bookings", route);

  const bookingController = new BookingController();

  route.post(
    "/sessions/:id/reserve/",
    isAuth,
    attachCurrentUser,
    bookingController.reserve
  );
  route.post("/confirm", bookingController.confirm);
  route.get("/sessions/:id/seats", bookingController.getSeatMap);
};
