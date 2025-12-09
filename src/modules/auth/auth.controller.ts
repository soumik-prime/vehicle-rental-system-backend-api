import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signinUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authServices.signinUser(email, password);
    if (result === null) {
      res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    } else if (result === false) {
      res.status(401).json({
        success: false,
        message: "Invalid Passwordd",
      });
    } 
    else {
      res.status(200).json({
        success: true,
        message: "Signin successfull!",
        data: {
          token: result.token,
          user: result.user,
        },
      });
    }
  } catch (err: any) {
    console.log("Error from auth.controller module");
    res.status(500).json({
      success: false,
      message: err.message,
      details: err
    });
  }
};

const signupUser = async (req: Request, res: Response) => {
  try{
    const result = await authServices.signupUser(req.body);

    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Unable to create an user!",
      });
    }

    const { password, ...user } = result;

    res.status(201).json(
      {
        success: true,
        message: "User registered successfully",
        data: user
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


export const authControllers = {
  signinUser,
  signupUser
};
