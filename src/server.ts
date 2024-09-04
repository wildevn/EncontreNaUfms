import "module-alias/register";
import app from "./app";
import { db } from "./db";
import { Users } from "@database/schema";

const server = async () => {
  const port = process.env.SERVER_PORT
    ? Number.parseInt(process.env.SERVER_PORT)
    : 4001;

  // const dbConnection = await db();
  // const result = await dbConnection.select({ id: Users.id }).from(Users);
  // console.log(result);

  app.listen({ port }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    console.log(`Server listening on ${address}`);
  });
};

server();
