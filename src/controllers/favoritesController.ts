import decodeToken from "@/helpers/decodeToken";
import isAuth from "@/middlewares/isAuth";
import changeFavoriteService from "@/services/localesServices/changeFavoriteService";
import type {
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from "fastify";

export type ChangeRequest = {
  Params: { localeId: string };
};

export const changeOtps: RouteShorthandOptions = {
  schema: {
    headers: {
      type: "object",
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

const change = async (
  request: FastifyRequest<ChangeRequest>,
  reply: FastifyReply,
) => {
  const { localeId } = request.params;
  let userId = 0;

  if ("authorization" in request.headers && request.headers.authorization) {
    const { authorization } = request.headers;
    userId = decodeToken(authorization);
  }

  const favoritedLocale = await changeFavoriteService(
    Number.parseInt(localeId),
    userId,
  );

  if ("error" in favoritedLocale) {
    return reply
      .status(favoritedLocale.status)
      .send({ error: favoritedLocale.error });
  }
  return reply
    .status(favoritedLocale.status)
    .send({ result: favoritedLocale.result });
};

export default { change };
