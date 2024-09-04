import "./bootstrap";
import Fastify from "fastify";
import routes from "@routes/routes";

const app = Fastify({
  logger: true,
});

app.register(routes);

export default app;
