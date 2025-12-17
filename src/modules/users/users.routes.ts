import { Router } from "express";
import auth from "../../middlewares/auth";
import { userRole } from "../../types/auth/enum";
import { usersController } from "./users.controller";
import ownerOrAdmin from "../../middlewares/ownerOrAdmin";

const router = Router();

router.get("/", auth(userRole.ADMIN), usersController.getAllUser)
router.put("/:userId", 
            auth(userRole.ADMIN, userRole.CUSTOMER), 
            ownerOrAdmin("userId"), 
            usersController.putUserbyId
          );
router.delete("/:userId", auth(userRole.ADMIN), usersController.deleteUserById);

export const userRoutes = router;
