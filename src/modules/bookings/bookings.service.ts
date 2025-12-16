import { pool } from "../../config/db";


const createBooking = async (Payload: Record<string, any>, status: string) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
    Payload;
  const result = await pool.query(
    `
    INSERT INTO bookings
      (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    SELECT
      $1, $2, $3, $4,
      ($4::date - $3::date + 1) * daily_rent_price,
      $5
    FROM vehicles v
    WHERE v.id = $2
    RETURNING *
    `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, status]
  );
  return result.rows[0];
};


const getBookingById = async (id: string) => {
  const result = await pool.query(
    `
    SELECT
      b.id,
      b.customer_id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      v.vehicle_name,
      v.daily_rent_price
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.id = $1
    `,
    [ id ]
  );
  return result.rows[0];
};


const getAllBookings = async () => {
  const result = await pool.query(
    `SELECT
      b.id,
      b.customer_id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      u.name,
      u.email,
      v.vehicle_name,
      v.registration_number
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    `
  );
  return result.rows;
};


const getBookingsByCustomerId = async (customer_id: number) => {
  const result = await pool.query(
    `
    SELECT
      b.id,
      b.customer_id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      u.name,
      u.email,
      v.vehicle_name,
      v.registration_number,
      v.type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    JOIN users u ON b.customer_id = u.id
    WHERE customer_id = $1
    `,
    [ customer_id ]
  );
  return result.rows;
};


const updateBookingStatus = async (booking_id: string, status: string) => {
  const result = await pool.query(
    `
    UPDATE bookings
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
    [status, booking_id]
  );
  return result.rows[0];
};


export const bookingsService = {
  createBooking,
  getBookingById,
  getAllBookings,
  getBookingsByCustomerId,
  updateBookingStatus
};
