import "./bootstrap";
import Fastify from "fastify";
import routes from "@routes/routes";

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
});

app.register(routes);

export default app;
