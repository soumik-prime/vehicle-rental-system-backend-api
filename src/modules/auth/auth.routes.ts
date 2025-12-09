import { Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router();

router.post('/signin', authControllers.signinUser);
router.post('/signup', authControllers.signupUser);

export const authRoutes = router;