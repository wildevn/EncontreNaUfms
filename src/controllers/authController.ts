import refreshToken, { type NewTokenReply } from "@/helpers/refreshToken";
import verifyToken from "@/helpers/verifyToken";
import createOrUpdateUserService, {
  type UserReply,
  type User,
  type ErrorType,
} from "@/services/userServices/createOrUpdateUserService";
import logInService from "@/services/userServices/logInService";
import recoveryPasswordService, {
  type Reply,
} from "@/services/userServices/recoveryPasswordService";
import type {
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from "fastify";

export type AuthRequest = {
  Body: {
    name?: string;
    email: string;
    password: string;
  };
};

export type RegisterRequest = {
  Body: {
    name: string;
    email: string;
    password: string;
  };
};

export type RecoveryRequest = {
  Body: {
    email: string;
  };
};
export type TokenRequest = {
  Headers: {
    authorization: string;
  };
};

type AccessToken = {
  token: string;
};
export const loginOpts: RouteShorthandOptions = {
  schema: {
    body: {
      type: "object",
      required: ["email", "password"],
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        password: { type: "string" },
      },
    },
  },
};

export const registerOpts: RouteShorthandOptions = {
  schema: {
    body: {
      type: "object",
      required: ["name", "email", "password"],
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        password: { type: "string" },
      },
    },
  },
};

export const recoveryOpts: RouteShorthandOptions = {
  schema: {
    body: {
      type: "object",
      required: ["email"],
      properties: {
        email: { type: "string" },
      },
    },
  },
};
export const tokenOpts: RouteShorthandOptions = {
  schema: {
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: {
          type: "string",
        },
      },
    },
  },
};

type VerifyResult = {
  result?: string;
  error?: string;
};

const login = async (
  request: FastifyRequest<AuthRequest>,
  reply: FastifyReply,
): Promise<User | ErrorType> => {
  const { email, password } = request.body;
  const loggedUser: UserReply = await logInService(email, password);

  if ("error" in loggedUser) {
    return reply.status(loggedUser.status).send({ error: loggedUser.error });
  }
  return reply.status(loggedUser.status).send({ ...loggedUser });
};

const register = async (
  request: FastifyRequest<RegisterRequest>,
  reply: FastifyReply,
): Promise<User | ErrorType> => {
  const { name, email, password } = request.body;

  const newUser: UserReply = await createOrUpdateUserService(
    name,
    email,
    password,
  );

  if ("error" in newUser) {
    return reply.status(newUser.status).send({ error: newUser.error });
  }
  return reply.status(newUser.status).send({ ...newUser });
};

const recovery = async (
  request: FastifyRequest<RecoveryRequest>,
  reply: FastifyReply,
): Promise<Reply> => {
  const { email } = request.body;

  const result: Reply = await recoveryPasswordService(email);

  if ("error" in result) {
    return reply.status(result.status).send({ error: result.error });
  }
  return reply.status(result.status).send({ ...result });
};

const refresh = async (
  request: FastifyRequest<TokenRequest>,
  reply: FastifyReply,
): Promise<AccessToken | ErrorType> => {
  const { authorization } = request.headers;

  if (!authorization) {
    return reply.status(400).send({ error: "No token provided" });
  }

  const [_, token] = authorization.split(" ");
  const isValid: boolean = verifyToken(token, "refresh");

  if (!isValid) {
    return reply.status(401).send({ error: "Invalid refresh token provided" });
  }

  const newToken: NewTokenReply = await refreshToken(token);

  if ("error" in newToken) {
    return reply
      .status(newToken.status ? newToken.status : 500)
      .send({ error: "internalServerError" });
  }
  return reply.status(200).send({ ...newToken });
};

const verify = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<VerifyResult> => {
  const { authorization } = request.headers;
  if (!authorization) {
    return reply.status(400).send({ error: "No token provided" });
  }

  const [_, token] = authorization.split(" ");
  const isValid: boolean = verifyToken(token, "access");
  if (!isValid) {
    return reply.status(401).send({ error: "Invalid access token provided" });
  }
  return reply.status(200).send({ result: "valid token" });
};

export default { login, register, recovery, refresh, verify };
