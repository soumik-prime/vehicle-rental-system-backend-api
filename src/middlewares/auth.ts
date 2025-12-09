import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { envVariable } from '../config/env';
import { AuthUserPayload } from '../types/express';


const auth = (...roles: string[]) => {
  return async (req: Request, res:Response, next: NextFunction) => {
    try{
      const token = req.headers.authorization?.split(' ')[1];

      if(!token){
        return res.status(401).json(
          {
            success: false,
            message: "Authorization token missing."
          }
        )
      }
      // console.log(roles);
      const decode = jwt.verify(token, envVariable.jwt_secrate as string) as AuthUserPayload;
      // console.log(decode);
      if(roles.includes(decode.role)){
        req.user = decode;
        return next();
      }
      else return res.status(403).json(
        {
          success: false,
          message: "Access forbidden."
        }
      )

    }
    catch(err: any){
    res.status(500).json(
      {
        success: false,
        message: err.message,
        errors: err
      }
    )
  }
  }
}

export default auth;