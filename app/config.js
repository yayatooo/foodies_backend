import dotenv from "dotenv";

dotenv.config();

export const secretKey = process.env.SECRET_KEY;
export const serviceName = process.env.SERVICE_NAME;
export const dbHost = process.env.DB_HOST;
export const dbPort = process.env.DB_PORT;
export const dbUser = process.env.DB_USER;
export const dbPass = process.env.DB_PASS;
export const dbName = process.env.DB_NAME;
