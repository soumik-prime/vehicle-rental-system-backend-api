
import { usersService } from "./users.service"
import { Request, Response } from 'express';


const getAllUser = async(req: Request, res: Response) => {
  try{
    const result = await usersService.getAllUser();
    res.status(200).json(
      {
        success: true,
        message: "Users retrieved successfully",
        data: result.rows
      }
    )
  }
  catch(err: any){
    res.status(500).json(
      {
        success: false,
        message: err.message,
        error: err?.message ?? "Internal server error"
      }
    )
  }
}

const putUserbyId = async(req: Request, res: Response) => {
  try{
    const result = await usersService.putUserbyId(req.body, req.params.userId as string);
    // console.log(result.rows);
    if(!result || result.rowCount === 0){
      return res.status(404).json(
        {
          success: false,
          message: "User not found or could not be updated"
        }
      )
    }
    const { password, ...user } = result.rows[0];
    res.status(200).json(
      {
        success: true, 
        message: "User updated successfully",
        data: user
      }
    )
  }
  catch(err: any){
    res.status(500).json(
      {
        success: false,
        message: err.message,
        error: err?.message ?? "Internal server error"
      }
    )
  }
}

export const usersController = {
  getAllUser,
  putUserbyId
}