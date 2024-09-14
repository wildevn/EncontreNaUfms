import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import authController, {
  loginOpts,
  registerOpts,
  refreshOpts,
} from "@controllers/authController";

const auth = async (app: FastifyInstance, options: FastifyPluginOptions) => {
  app.post("/auth/login", loginOpts, authController.login);
  app.post("/auth/register", registerOpts, authController.register);
  app.post("/auth/refresh", refreshOpts, authController.refresh);
};

export default auth;
