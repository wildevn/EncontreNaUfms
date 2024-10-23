import isAuth from "@/middlewares/isAuth";
import isUser from "@/middlewares/isUser";
import createOrUpdateUserService, {
  type UserReply,
  type User,
  type ErrorType,
} from "@/services/userServices/createOrUpdateUserService";
import deleteUserService from "@/services/userServices/deleteUserService";
import getUserInfoService from "@/services/userServices/getUserInfoService";
import type {
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from "fastify";

export type EditRequest = {
  Body: {
    name: string;
    email: string;
    password: string;
  };
};

export type InfoRequest = {
  Params: {
    email: string;
  };
};

export type DeleteRequest = {
  Headers: {
    authentication: string;
  };
  Params: {
    userEmail: string;
  };
};

export const editOpts: RouteShorthandOptions = {
  schema: {
    body: {
      type: "object",
      required: ["email"],
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        password: { type: "string" },
      },
    },
  },
  preHandler: isUser,
};

export const userInfoOpts: RouteShorthandOptions = {
  schema: {
    params: {
      type: "object",
      required: ["email"],
      properties: {
        email: { type: "string" },
      },
    },
  },
  preHandler: isAuth,
};

export const userDeleteOpts: RouteShorthandOptions = {
  schema: {
    headers: {
      type: "object",
      properties: {
        authentication: {
          type: "string",
        },
      },
    },
    params: {
      type: "object",
      required: ["userEmail"],
      properties: {
        userEmail: { type: "string" },
      },
    },
  },
  preHandler: isUser,
};

const edit = async (
  request: FastifyRequest<EditRequest>,
  reply: FastifyReply,
): Promise<User | ErrorType> => {
  const { name, email, password } = request.body;

  const user: UserReply = await createOrUpdateUserService(
    name,
    email,
    password,
    true,
  );

  if ("error" in user) {
    return reply.status(user.status).send({ error: user.error });
  }
  return reply.status(user.status).send({ user: user.user });
};

const info = async (
  request: FastifyRequest<InfoRequest>,
  reply: FastifyReply,
): Promise<User | ErrorType> => {
  const { email } = request.params;

  const user: UserReply = await getUserInfoService(email);

  if ("error" in user) {
    return reply.status(user.status).send({ error: user.error });
  }
  return reply.status(user.status).send({ user: user.user });
};

const deleteByEmail = async (
  request: FastifyRequest<DeleteRequest>,
  reply: FastifyReply,
) => {
  const { userEmail } = request.params;
  if (userEmail) {
    const deletedUser = await deleteUserService(userEmail);

    if ("error" in deletedUser) {
      return reply
        .status(deletedUser.status)
        .send({ error: deletedUser.error });
    }
    return reply
      .status(deletedUser.status)
      .send({ result: deletedUser.result });
  }
  return reply.status(400).send({ error: "required parameter: userEmail" });
};

export default { edit, info, deleteByEmail };
