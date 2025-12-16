import { Router } from "express";
import auth from "../../middlewares/auth";
import { userRole } from "../../types/auth/enum";
import { vehiclesController } from "./vehicles.controller";

const router = Router();

router.post("/", auth(userRole.ADMIN), vehiclesController.createVehicle);
router.get("/", vehiclesController.getVehicles);
router.get("/:vehicleId", vehiclesController.getVehicleById);
router.put("/:vehicleId", auth(userRole.ADMIN), vehiclesController.putVehicleById);
// router.put("/:vehicleId", auth(userRole.ADMIN), ___);

export const vehiclesRoutes = router;