import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const createDbConnection = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  return drizzle(connection);
};

export const db = async () => await createDbConnection();
