import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import locales from "./locales";
import users from "./users";
import auth from "./auth";

const routes = async (app: FastifyInstance, options: FastifyPluginOptions) => {
  app.register(locales);
  app.register(users);
  app.register(auth);
};

export default routes;
