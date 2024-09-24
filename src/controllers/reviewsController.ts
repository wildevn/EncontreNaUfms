import decodeToken from "@/helpers/decodeToken";
import isAuth from "@/middlewares/isAuth";
import createOrUpdateReviewService from "@/services/localesServices/createOrUpdateReviewService";
import deleteReviewService from "@/services/localesServices/deleteReviewService";
import getReviewService from "@/services/localesServices/getReviewService";
import type {
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from "fastify";

export type CreateOrUpdateRequest = {
  Headers: {
    authorization: string;
  };
  Params: {
    localeId: string;
  };
  Body: {
    grade: string;
  };
};

export type GetReviewRequest = {
  Headers: {
    authorization: string;
  };
  Params: {
    localeId: string;
  };
};

export type DeleteByIdRequest = {
  Headers: {
    authorization: string;
  };
  Params: {
    localeId: string;
  };
};

export const createOrUpdateOtps: RouteShorthandOptions = {
  schema: {
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: { type: "string" },
      },
    },
    params: {
      type: "object",
      required: ["localeId"],
      properties: {
        localeId: { type: "string" },
      },
    },
    body: {
      type: "object",
      required: ["grade"],
      properties: {
        grade: { type: "string" },
      },
    },
  },
  preHandler: isAuth,
};

export const getReviewOtps: RouteShorthandOptions = {
  schema: {
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: { type: "string" },
      },
    },
    params: {
      type: "object",
      required: ["localeId"],
      properties: {
        localeId: { type: "string" },
      },
    },
  },
  preHandler: isAuth,
};

export const deleteByIdOtps: RouteShorthandOptions = {
  schema: {
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: { type: "string" },
      },
    },
    params: {
      type: "object",
      required: ["localeId"],
      properties: {
        localeId: { type: "string" },
      },
    },
  },
  preHandler: isAuth,
};

const createOrUpdate = async (
  request: FastifyRequest<CreateOrUpdateRequest>,
  reply: FastifyReply,
) => {
  const { localeId } = request.params;
  const { grade } = request.body;

  if ("authorization" in request.headers && request.headers.authorization) {
    const { authorization } = request.headers;
    const userId = decodeToken(authorization);

    if (userId) {
      const result = await createOrUpdateReviewService(
        Number.parseInt(localeId),
        userId,
        grade,
      );

      if ("error" in result) {
        return reply.status(result.status).send({ error: result.error });
      }
      return reply.status(result.status).send({ result: result.result });
    }
    return reply
      .status(401)
      .send({ error: "Unauthorized, token not recognized or invalid User" });
  }
  return reply.status(401).send({ error: "Unauthorized" });
};

const getReview = async (
  request: FastifyRequest<GetReviewRequest>,
  reply: FastifyReply,
) => {
  const { localeId } = request.params;
  if ("authorization" in request.headers && request.headers.authorization) {
    const { authorization } = request.headers;
    const userId = decodeToken(authorization);
    if (userId) {
      const result = await getReviewService(Number.parseInt(localeId), userId);
      if ("error" in result) {
        return reply.status(result.status).send({ error: result.error });
      }
      return reply.status(result.status).send({ result: result.result });
    }
    return reply
      .status(401)
      .send({ error: "Unauthorized, token not recognized or invalid User" });
  }
  return reply.status(401).send({ error: "Unauthorized" });
};

const deleteById = async (
  request: FastifyRequest<DeleteByIdRequest>,
  reply: FastifyReply,
) => {
  const { localeId } = request.params;
  if ("authorization" in request.headers && request.headers.authorization) {
    const { authorization } = request.headers;
    const userId = decodeToken(authorization);
    if (userId) {
      const result = await deleteReviewService(
        Number.parseInt(localeId),
        userId,
      );

      if ("error" in result) {
        return reply.status(result.status).send({ error: result.error });
      }
      return reply.status(result.status).send({ result: result.result });
    }
    return reply
      .status(401)
      .send({ error: "Unauthorized, token not recognized or invalid User" });
  }
  return reply.status(401).send({ error: "Unauthorized" });
};

export default { createOrUpdate, getReview, deleteById };
