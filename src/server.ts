import "module-alias/register";
import app from "./app";

const server = async () => {
  const port = process.env.SERVER_PORT
    ? Number.parseInt(process.env.SERVER_PORT)
    : 4001;

  app.listen({ port }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    console.log(`Server listening on ${address}`);
  });
};

server();
