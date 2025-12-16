import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import { envVariable } from "../../config/env";
import jwt from "jsonwebtoken";
import { AuthUserPayload } from "../../types/express";

const signinUser = async (email: string, password: string) => {
  // console.log("Pg doesn't looks ok!");
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
  // console.log("Pg looks ok!");
  if (result.rowCount === 0) return null;

  const user = result.rows[0];
  const matched = await bcrypt.compare(password, user.password);

  if (!matched) return false;

  const secret = envVariable.jwt_secrate as string;
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
    {
      expiresIn: "10d",
    }
  );
  const authUser: AuthUserPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  }
  return {token, user: authUser};
};

const signupUser = async (Payload: Record<string, any>) => {
  const { name, email, password, phone, role } = Payload;
  const hashedpassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [ name, email, hashedpassword, phone, role ]
  );
  return result.rows[0];
}

export const authServices = {
  signinUser,
  signupUser
}
