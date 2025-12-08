import { Pool } from "pg";
import { envVariable } from "./env";


export const pool = new Pool(
    {
        connectionString: envVariable.connection_db
    }
);

export const initDB = async() => {
    await pool.query(
        `CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(25) NOT NULL,
        role VARCHAR(15)
        );`
    );

    await pool.query(
        `CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(150),
        type VARCHAR(5) NOT NULL,
        registration_number VARCHAR(50) UNIQUE NOT NULL,
        daily_rent_price VARCHAR(15) NOT NULL,
        availability_status VARCHAR(15)
        );`
    );

    await pool.query(
        `CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date TIMESTAMP DEFAULT NOW(),
        rent_end_date TIMESTAMP NOT NULL,
        total_price VARCHAR(15) NOT NULL,
        status VARCHAR(15) NOT NULL
        );`
    );

}