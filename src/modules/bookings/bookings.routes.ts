import { Router } from "express";
import { bookingsController } from "./bookings.controller";
import auth from "../../middlewares/auth";
import { userRole } from "../../types/auth/enum";

const router = Router();

router.get("/", auth(userRole.ADMIN, userRole.CUSTOMER), bookingsController.getBookings);
router.post("/", bookingsController.createBooking);
router.put("/:bookingId", auth(userRole.ADMIN, userRole.CUSTOMER), bookingsController.updateBookingStatus);

export const bookingsRoutes = router;