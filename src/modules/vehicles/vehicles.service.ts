import { pool } from "../../config/db";

const createVehicle = async(Payload: Record<string, any>) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = Payload;
  const result = await pool.query(
    `INSERT INTO 
    vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status)
    VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [ vehicle_name, type, registration_number, daily_rent_price, availability_status ]
  );
  return result;
}

const getVehicles = async() => {
  const result = await pool.query(
    `SELECT * FROM vehicles`
  );
  return result.rows;
}

const getVehicleById = async(id: string) => {
  const result = await pool.query(
    `SELECT * FROM vehicles WHERE id = $1`,
    [ id ]
  );
  return result;
}

const putVehicleById = async(Payload: Record<string, any>, id: string) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = Payload;
  const result = await pool.query(
    `UPDATE vehicles
    SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5
    WHERE id=$6
    RETURNING *`,
    [ vehicle_name, type, registration_number, daily_rent_price, availability_status, id ]
  )
  return result;
}

const deleteVehicleById = async(id: string) => {
  const result = await pool.query(
    `
    DELETE FROM vehicles
    WHERE id = $1
      AND availability_status <> $2
    RETURNING *
    `,
    [
      id,
      "booked"
    ]
  );
  return result;
}

export const vehiclesService = {
  createVehicle,
  getVehicles,
  getVehicleById,
  putVehicleById,
  deleteVehicleById
}