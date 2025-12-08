import dotenv from "dotenv";
import path from "path";

dotenv.config(
    {
        path: path.join(process.cwd(), '/.env')
    }
);

const connection_db = process.env.CONNECTION_STR;
const port = process.env.PORT;
const jwt_secrate = process.env.JWT_SECRET;

export const envVariable = {
    connection_db,
    port,
    jwt_secrate
};