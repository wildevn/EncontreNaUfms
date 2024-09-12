import createOrUpdateUserService, {
  type UserReply,
  type User,
  type ErrorType,
} from "@/services/userServices/createOrUpdateUserService";
import getUserInfoService from "@/services/userServices/getUserInfoService";
import type {
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from "fastify";
import authenticateToken from "@/middlewares/authenticateTocken";

export type CreateOrEditRequest = FastifyRequest<{
  Body: {
    name: string;
    email: string;
    password: string;
    userId?: number;
  };
}>;

export type InfoRequest = FastifyRequest<{
  Params: {
    userId: string;
  };
}>;

export const createOrEditOpts: RouteShorthandOptions = {
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
  // preHandler: authenticateToken,
};

export const userInfoOpts: RouteShorthandOptions = {
  schema: {
    params: {
      type: "object",
      required: ["userId"],
      properties: {
        userId: { type: "string" },
      },
    },
  },
  // preHandler: authenticateToken,
};

const createOrEdit = async (
  request: CreateOrEditRequest,
  reply: FastifyReply,
): Promise<User | ErrorType> => {
  const { name, email, password, userId } = request.body;

  const user: UserReply = await createOrUpdateUserService(
    name,
    email,
    password,
    userId,
  );

  if ("error" in user) {
    return reply.status(user.status).send({ error: user.error });
  }

  return reply.status(user.status).send({ user: user.data });
};

const info = async (
  request: InfoRequest,
  reply: FastifyReply,
): Promise<User | ErrorType> => {
  const { userId } = request.params;

  const user: UserReply = await getUserInfoService(Number.parseInt(userId));

  if ("error" in user) {
    return reply.status(user.status).send({ error: user.error });
  }
  return reply.status(user.status).send({ user: user.data });
};

export default { createOrEdit, info };
