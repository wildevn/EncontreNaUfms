import showLocalesService from "@/services/localesServices/showLocalesService";
import listSectionService from "@services/localesServices/listSectionService";
import type {
  FastifyBaseLogger,
  FastifyReply,
  FastifyRequest,
  FastifyTypeProviderDefault,
  RawServerDefault,
  RouteGenericInterface,
  RouteShorthandOptions,
} from "fastify";
import type { IncomingMessage, ServerResponse } from "node:http";

type AllLocalesRequest = FastifyRequest<{
  Querystring: { pageNumber: string; limit: string; userId: string };
}>;

type CategoryRequest = FastifyRequest<{
  Params: { category: string };
  Querystring: { pageNumber: string; limit: string; userId: string };
}>;

type SectionRequest = FastifyRequest<{
  Params: { localeId: string };
  Querystring: { sectionName: string };
}>;

export const listAllOpts: RouteShorthandOptions<
  RawServerDefault,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  RouteGenericInterface,
  unknown,
  FastifySchema,
  FastifyTypeProviderDefault,
  FastifyBaseLogger
> = {
  schema: {
    querystring: {
      type: "object",
      properties: {
        pageNumber: { type: "string" },
        limit: { type: "string" },
        userId: { type: "string" },
      },
    },
  },
};

export const listCategoryOpts: RouteShorthandOptions<
  RawServerDefault,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  RouteGenericInterface,
  unknown,
  FastifySchema,
  FastifyTypeProviderDefault,
  FastifyBaseLogger
> = {
  schema: {
    request: {
      type: "object",
      properties: {
        category: { type: "string" },
      },
    },
    querystring: {
      type: "object",
      properties: {
        pageNumber: { type: "string" },
        limit: { type: "string" },
      },
    },
  },
};

export const listSectionOpts: RouteShorthandOptions<
  RawServerDefault,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  RouteGenericInterface,
  unknown,
  FastifySchema,
  FastifyTypeProviderDefault,
  FastifyBaseLogger
> = {
  schema: {
    request: {
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

const showAll = async (request: AllLocalesRequest, reply: FastifyReply) => {
  const { pageNumber, limit, userId } = request.query;

  const locales = await showLocalesService(
    Number.parseInt(pageNumber ? pageNumber : "1"),
    Number.parseInt(limit ? limit : "10"),
    Number.parseInt(userId),
  );

  reply.send({ data: locales });
};

const listCategory = async (request: CategoryRequest, reply: FastifyReply) => {
  const { category } = request.params;
  const { pageNumber, limit, userId } = request.query;

  const locales = await showLocalesService(
    Number.parseInt(pageNumber ? pageNumber : "1"),
    Number.parseInt(limit ? limit : "10"),
    Number.parseInt(category ? category : "-1"),
    Number.parseInt(userId),
  );

  reply.send({ data: locales });
};

const listSection = async (request: SectionRequest, reply: FastifyReply) => {
  const { localeId } = request.params;
  const { sectionName } = request.query;

  const sectionInfo = await listSectionService(localeId, sectionName);

  reply.send({ data: sectionInfo });
};

export default { showAll, listCategory, listSection };
