import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import authController, {
  loginOpts,
  registerOpts,
  refreshOpts,
  type AuthRequest,
  type RegisterRequest,
  type RefreshRequest,
} from "@controllers/authController";

const auth = async (app: FastifyInstance, options: FastifyPluginOptions) => {
  app.post<AuthRequest>("/auth/login", loginOpts, authController.login);
  app.post<RegisterRequest>(
    "/auth/register",
    registerOpts,
    authController.register,
  );
  app.get<RefreshRequest>("/auth/refresh", refreshOpts, authController.refresh);
};

export default auth;
