import { Request, Response } from 'express';
import { vehiclesService } from './vehicles.service';


const createVehicle = async(req: Request, res: Response) => {
  try{
    const result = await vehiclesService.createVehicle(req.body);
    if(result){
      res.status(201).json(
        {
          success: true,
          message: "Vehicle created successfully",
          data: result
        }
      )
    }
    else{
      res.status(500).json(
        {
          success: false,
          message: "Failed to create vehicle"
        }
      )
    }
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

const getVehicles = async(req: Request, res: Response) => {
  try{
    const result = await vehiclesService.getVehicles();
    if(result.length !== 0){
      res.status(200).json(
        {
          success: true,
          message: "Vehicles retrieved successfully",
          data: result
        }
      )
    }
    else{
      res.status(200).json(
        {
          success: false,
          message: "No vehicles found",
          data: result
        }
      )
    }
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

const getVehicleById = async(req: Request, res: Response) => {
  const { vehicleId } = req.params;
  try{
    const result = await vehiclesService.getVehicleById(vehicleId as string);
    if(result.rowCount === 0){
      res.status(404).json(
        {
          "success": false,
          "message": "No vehicles found",
          "data": {}
        }
      )
    }
    else{
      res.status(200).json(
        {
          "success": true,
          "message": "Vehicle retrieved successfully",
          "data": result.rows[0]
        }
      )
    }
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

const putVehicleById = async(req: Request, res: Response) => {
  try{
    const result = await vehiclesService.putVehicleById(req.body, req.params.vehicleId as string);
    if(result.rowCount === 0){
      res.status(200).json(
        {
          "success": true,
          "message": "No vehicles found",
          "data": {}
        }
      )
    }
    else{
      res.status(200).json(
        {
          "success": true,
          "message": "Vehicle updated successfully",
          "data": result.rows[0]
        }
      )
    }
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

export const vehiclesController = {
  createVehicle,
  getVehicles,
  getVehicleById,
  putVehicleById
};