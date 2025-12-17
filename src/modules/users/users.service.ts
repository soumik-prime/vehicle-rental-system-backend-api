import { pool } from "../../config/db"

const getAllUser = async() => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );
  return result;
}

const putUserbyId = async(Payload: Record<string, any> , id:string) => {
  const { name, email, phone, role } = Payload;
  const result = await pool.query(
    `UPDATE users
    SET name = $1, email = $2, phone = $3, role = $4
    WHERE id=$5
    RETURNING *`,
    [ name, email, phone, role, id ]
  )
  return result;
}

const deleteUserById = async(id: string) => {
  const result = await pool.query(
    `
    DELETE FROM users
    WHERE id = $1
    RETURNING *
    `,
    [
      id
    ]
  );
  return result;
}

const getActiveBookingByCustomerId = async(customer_id: string) => {
  const result = await pool.query(
    `
    SELECT *
    FROM bookings
    WHERE customer_id = $1
      AND status = $2
    `,
    [
      customer_id,
      "active"
    ]
  )
  return result;
}

export const usersService = {
  getAllUser,
  putUserbyId,
  getActiveBookingByCustomerId,
  deleteUserById
}