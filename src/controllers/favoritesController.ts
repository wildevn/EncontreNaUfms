import verifyToken from "@/helpers/verifyToken";
import isAuth from "@/middlewares/isAuth";
import changeFavoriteService from "@/services/localesServices/changeFavoriteService";
import type {
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from "fastify";
import { decode } from "jsonwebtoken";

export type ChangeRequest = {
  Params: { localeId: string };
};

// export const listOtps: RouteShorthandOptions = {
//   schema: {
//     headers: {
//       type: "object",
//       required: ["authorization"],
//       properties: {
//         authorization: { type: "string" },
//       },
//     },
//   },
//   preHandler: isAuth,
// };

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

// const list = async (request: FastifyRequest, reply: FastifyReply) => {};

const change = async (
  request: FastifyRequest<ChangeRequest>,
  reply: FastifyReply,
) => {
  const { localeId } = request.params;
  let userId = 0;

  if ("authorization" in request.headers) {
    const { authorization } = request.headers;
    if (authorization) {
      const [_, token] = authorization.split(" ");
      const isValid = verifyToken(token, "access");
      if (isValid) {
        try {
          const decodedToken = decode(token);
          if (
            decodedToken &&
            typeof decodedToken === "object" &&
            "id" in decodedToken
          ) {
            userId = decodedToken.id;
          }
        } catch (error) {
          userId = 0;
        }
      }
    }
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
