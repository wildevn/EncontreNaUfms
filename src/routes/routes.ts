import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import locales from "./locales";
import users from "./users";

const routes = async (app: FastifyInstance, options: FastifyPluginOptions) => {
  app.register(locales);
  app.register(users);
};

export default routes;
