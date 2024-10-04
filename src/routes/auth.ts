import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import authController, {
  loginOpts,
  registerOpts,
  recoveryOpts,
  tokenOpts,
  type AuthRequest,
  type RegisterRequest,
  type RecoveryRequest,
  type TokenRequest,
} from "@controllers/authController";

const auth = async (app: FastifyInstance, options: FastifyPluginOptions) => {
  app.post<AuthRequest>("/auth/login", loginOpts, authController.login);
  app.post<RegisterRequest>(
    "/auth/register",
    registerOpts,
    authController.register,
  );
  app.post<RecoveryRequest>(
    "/auth/forgot-password",
    recoveryOpts,
    authController.recovery,
  );
  app.get<TokenRequest>("/auth/refresh", tokenOpts, authController.refresh);
  app.get<TokenRequest>("/auth/verify", tokenOpts, authController.verify);
};

export default auth;
