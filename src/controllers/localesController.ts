import showLocalesService from "@/services/localesServices/showLocalesService";
import type {
  Data,
  LocaleError,
} from "@services/localesServices/showLocalesService";
import listSectionService from "@services/localesServices/listSectionService";
import type {
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from "fastify";
import verifyToken from "@/helpers/verifyToken";
import { decode } from "jsonwebtoken";

export type ListLocalesRequest = {
  Params: { categoryList: string };
  Querystring: { pageNumber: string; limit: string };
};

export type SectionRequest = {
  Params: { localeId: string };
  Querystring: { sectionName: string };
};

export const listOpts: RouteShorthandOptions = {
  schema: {
    headers: {
      type: "object",
      properties: {
        authorization: { type: "string" },
      },
    },
    params: {
      type: "object",
      required: ["categoryList"],
      properties: {
        category: { type: "string" },
      },
    },
    querystring: {
      type: "object",
      required: ["pageNumber", "limit"],
      properties: {
        pageNumber: { type: "string" },
        limit: { type: "string" },
      },
    },
  },
};

export const listSectionOpts: RouteShorthandOptions = {
  schema: {
    headers: {
      type: "object",
      properties: {
        authorization: { type: "string" },
      },
    },
    params: {
      type: "object",
      properties: {
        localeId: { type: "string" },
      },
    },
    querystring: {
      type: "object",
      properties: {
        sectionName: { type: "string" },
      },
    },
  },
};

// continuar a função, finalizando
const list = async (
  request: FastifyRequest<ListLocalesRequest>,
  reply: FastifyReply,
) => {
  const { categoryList } = request.params;
  const { pageNumber, limit } = request.query;
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
  if (pageNumber && limit) {
    const parsedCategoryList: Array<string> =
      categoryList !== "" && categoryList.includes(",")
        ? categoryList.split(",")
        : categoryList === ""
          ? []
          : [categoryList];

    const data: Data | LocaleError = await showLocalesService(
      Number.parseInt(pageNumber),
      Number.parseInt(limit),
      userId,
      parsedCategoryList,
    );
    if ("error" in data) {
      return reply.status(400).send({ error: { message: data.error } });
    }
    return reply.status(200).send({ data });
  }
  const message: string = `Check parameter(s): ${pageNumber ? "" : "pageNumber,"} 
                            ${limit ? "" : "limit"}`;
  return reply.status(400).send({ error: { message } });
};

const listSection = async (
  request: FastifyRequest<SectionRequest>,
  reply: FastifyReply,
) => {
  const { localeId } = request.params;
  const { sectionName } = request.query;
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

  const sectionInfo = await listSectionService(localeId, sectionName, userId);

  return reply.status(200).send({ data: sectionInfo });
};

export default { list, listSection };
