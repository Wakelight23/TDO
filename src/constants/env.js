import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5555;
export const HOST = process.env.HOST || 'localhost';
export const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';

export const DB1_HOST = process.env.DB_HOST || 'localhost';
export const DB1_USER = process.env.DB_USER || 'root';
export const DB1_PASSWORD = process.env.DB_PASSWORD || 'password1';
export const DB1_NAME = process.env.DB_NAME || 'user';
export const DB1_PORT = process.env.DB_PORT || 3306;

export const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';
