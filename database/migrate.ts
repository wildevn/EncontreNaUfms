import { getDbConnection } from "@/models/db";
import { migrate } from "drizzle-orm/mysql2/migrator";

// This will run migrations on the database, skipping the ones already applied
migrate(getDbConnection, { migrationsFolder: "./drizzle" });

// Don't forget to close the connection, otherwise the script will hang
//connection.end();
