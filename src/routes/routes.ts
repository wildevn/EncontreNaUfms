import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import locales from "./locales";
import users from "./users";
import auth from "./auth";
import teste from "@services/teste";

const routes = async (app: FastifyInstance, options: FastifyPluginOptions) => {
  app.register(locales);
  app.register(users);
  app.register(auth);
  app.get("/teste", async (request, reply) => {
    await teste();
  });
};

export default routes;
