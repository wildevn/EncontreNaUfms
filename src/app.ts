import "./bootstrap";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import routes from "@routes/routes";
import path from "node:path";

const envToLogger = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};

const app = Fastify({
  logger: envToLogger.development ?? true,
  bodyLimit: 10048576,
});

app.register(fastifyStatic, {
  root: path.join(__dirname.replace("src", ""), "public"),
  prefix: "/public/",
});

app.register(routes);

export default app;
