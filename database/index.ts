import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const database = async() => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
  });
  
  const db = drizzle(connection);
} 

database()