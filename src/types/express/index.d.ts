import { JwtPayload } from "jsonwebtoken";
import { userRole } from "../auth/enum";

export interface AuthUserPayload extends JwtPayload {
    id: number
    name: string;
    email: string;
    phone: string
    role: userRole;
}

declare global {
  namespace Exprss {
    interface Request {
      user: AuthUserPayload
    }
  }
}