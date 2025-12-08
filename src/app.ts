import express, { Request, Response } from "express";
import logger from "./middlewares/logger";
import { initDB } from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";

const app = express();
initDB();

app.use(express.json());
app.use(logger);
app.use("/api/v1/auth", authRoutes);



app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;