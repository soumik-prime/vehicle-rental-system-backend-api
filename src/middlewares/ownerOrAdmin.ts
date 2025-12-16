import { NextFunction, Request, Response } from 'express';
import { userRole } from '../types/auth/enum';
const ownerOrAdmin = (resourceIdParam: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found.",
      });
    }
    if(req.user.role === userRole.ADMIN || String(req.user.id) === String(req.params[resourceIdParam])) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: "Forbidden. You can only access your own resource.",
    });
  }
}
export default ownerOrAdmin;