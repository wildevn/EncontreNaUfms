import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import authController, {
  loginOpts,
  registerOpts,
  recoveryOpts,
  validateRecoveryTokenOpts,
  tokenOpts,
  type AuthRequest,
  type RegisterRequest,
  type RecoveryRequest,
  type ValidateTokenRequest,
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
  app.post<ValidateTokenRequest>(
    "/auth/forgot-password/validate-token",
    validateRecoveryTokenOpts,
    authController.validateToken,
  );

  app.get<TokenRequest>("/auth/refresh", tokenOpts, authController.refresh);
  app.get<TokenRequest>("/auth/verify", tokenOpts, authController.verify);
};

export default auth;
