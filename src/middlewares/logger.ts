import { NextFunction, Request } from 'express';
import { Response } from 'express';

const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
}

export default logger;