import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 6666;
export const HOST = process.env.HOST || '127.0.0.1';
export const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';

export const SECRETKEY = process.env.SECRETKEY;

export const DB_NAME = process.env.DB_NAME || 'user_db';
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || '12341234';
export const DB_HOST = process.env.DB_HOST || '127.0.0.1';
export const DB_PORT = process.env.DB_PORT || '3306';