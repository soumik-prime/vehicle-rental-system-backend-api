import { Request, Response } from 'express';
import { bookingsService } from './bookings.service';
import { userRole } from '../../types/auth/enum';

const createBooking = async(req: Request, res: Response) => {
  try{
    const result = await bookingsService.createBooking(req.body, "active");
    console.log("Point: 1", result);
    if(!result){
      return res.status(400).json(
        {
          success: false,
          message: "Vehicles is already booked"
        }
      )
    }
    const newResult = await bookingsService.getBookingById(result.id);
    await bookingsService.updateVehicleAvailStatus(newResult.vehicle_id, "booked");
    // console.log(newResult);
    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        id: newResult.id,
        customer_id: newResult.customer_id,
        vehicle_id: newResult.vehicle_id,
        rent_start_date: new Date(newResult.rent_start_date).toISOString().split('T')[0],
        rent_end_date: new Date(newResult.rent_end_date).toISOString().split('T')[0],
        total_price: newResult.total_price,
        status: newResult.status,
        vehicle: {
          vehicle_name: newResult.vehicle_name,
          daily_rent_price: newResult.daily_rent_price
        }
      }
    });

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

const getBookings = async(req: Request, res: Response) => {
  try{
    if(req.user.role === userRole.ADMIN){
      const result = await bookingsService.getAllBookings();
      if(result.length === 0){
        return res.status(404).json(
          {
            success: false,
            message: "No booking is found.",
            data: []
          }
        )
      }
      const data = result.map(element => {
        return {
          id: element.id,
          customer_id: element.customer_id,
          vehicle_id: element.vehicle_id,
          rent_start_date: new Date(element.rent_start_date).toISOString().split('T')[0],
          rent_end_date: new Date(element.rent_end_date).toISOString().split('T')[0],
          total_price: element.total_price,
          status: element.status,
          customer: {
            name: element.name,
            email: element.email
          },
          vehicle: {
            vehicle_name: element.vehicle_name,
            registration_number: element.registration_number
          }
        }
      });
      return res.status(200).json(
        {
          success: true,
          message: "Bookings retrieved successfully",
          data
        }
      )
    }

    const result = await bookingsService.getBookingsByCustomerId(req.user.id);
    if(result.length === 0){
      return res.status(404).json(
        {
          success: false,
          message: "No booking is found.",
          data: []
        }
      )
    }
    const data = result.map(element => {
      return {
        id: element.id,
        customer_id: element.customer_id,
        vehicle_id: element.vehicle_id,
        rent_start_date: new Date(element.rent_start_date).toISOString().split('T')[0],
        rent_end_date: new Date(element.rent_end_date).toISOString().split('T')[0],
        total_price: element.total_price,
        status: element.status,
        vehicle: {
          vehicle_name: element.vehicle_name,
          registration_number: element.registration_number,
          type: element.type
        }
      }
    });
    return res.status(200).json(
      {
        success: true,
        message: "Bookings retrieved successfully",
        data
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

const updateBookingStatus = async(req: Request, res: Response) => {
  try{
    const { status } = req.body;
    if(req.user.role === userRole.ADMIN && status === "returned"){
      const result = await bookingsService.updateBookingStatus(req.params.bookingId as string, status);
      if(result){
        const vehicle = await bookingsService.updateVehicleAvailStatus(result.vehicle_id, "available");
        return res.status(200).json(
          {
            "success": true,
            "message": "Booking marked as returned. Vehicle is now available",
            "data": {
              id: result.id,
              customer_id: result.customer_id,
              vehicle_id: result.vehicle_id,
              rent_start_date: new Date(result.rent_start_date).toISOString().split('T')[0],
              rent_end_date: new Date(result.rent_end_date).toISOString().split('T')[0],
              total_price: result.total_price,
              status: result.status,
              "vehicle": {
                availability_status: vehicle.availability_status
              }
            }
          }
        )
      }
      else{
        return res.status(404).json(
          {
            success: false,
            message: "Booking not found",
            data: {}
          }
        );
      }
    }

    if(req.user.role === userRole.CUSTOMER && status === "cancelled"){
      const result = await bookingsService.updateBookingStatus(req.params.bookingId as string, status);
      if(result){
        await bookingsService.updateVehicleAvailStatus(result.vehicle_id, "available");
        return res.status(200).json(
          {
            "success": true,
            "message": "Booking cancelled successfully",
            "data": {
              id: result.id,
              customer_id: result.customer_id,
              vehicle_id: result.vehicle_id,
              rent_start_date: new Date(result.rent_start_date).toISOString().split('T')[0],
              rent_end_date: new Date(result.rent_end_date).toISOString().split('T')[0],
              total_price: result.total_price,
              status: result.status,
            }
          }
        )
      }
      else{
        return res.status(404).json(
          {
            success: false,
            message: "Booking not found",
            data: {}
          }
        );
      }
    }

    return res.status(403).json(
      {
        success: false,
        message: "You are not allowed to update this booking status",
        data: {}
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

export const bookingsController = {
  createBooking,
  getBookings,
  updateBookingStatus
}