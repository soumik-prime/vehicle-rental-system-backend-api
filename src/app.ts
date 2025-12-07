import express, { Request, Response } from "express";
import logger from "./middlewares/logger";

const app = express();
app.use(express.json());

app.use(logger, (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;