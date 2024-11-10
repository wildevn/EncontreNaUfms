import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

let dbConnection: MySql2Database;

const createDbConnection = async () => {
  if (!dbConnection) {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    dbConnection = drizzle(connection);
  }

  return dbConnection;
};

export const getDbConnection = async () => await createDbConnection();
