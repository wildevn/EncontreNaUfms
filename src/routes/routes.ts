import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import locales from "./locales";

const routes = async (app: FastifyInstance, options: FastifyPluginOptions) => {
	app.register(locales);
};

export default routes;
