import showAllService from "../services/localesServices/showAllService";
import listCategoryService from "../services/localesServices/listCategoryService";
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
import listSectionService from "@services/localesServices/listSectionService";

type CategoryRequest = FastifyRequest<{
  Params: { category: string };
}>;

type SectionRequest = FastifyRequest<{
  Params: { localeId: string };
  Querystring: { sectionName: string };
}>;

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

const showAll = async (request: FastifyRequest, reply: FastifyReply) => {
  const locales = await showAllService();

  reply.send({ data: locales });
};

const listCategory = async (request: CategoryRequest, reply: FastifyReply) => {
  const { category } = request.params;

  const locales = await listCategoryService(category);

  reply.send({ data: locales });
};

const listSection = async (request: SectionRequest, reply: FastifyReply) => {
  const { localeId } = request.params;
  const { sectionName } = request.query;

  const sectionInfo = await listSectionService(localeId, sectionName);

  reply.send({ data: sectionInfo });
};

export default { showAll, listCategory, listSection };
