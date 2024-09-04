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
  const locales = await showLocalesService();

  reply.send({ data: locales });
};

const listCategory = async (request: CategoryRequest, reply: FastifyReply) => {
  const { category } = request.params;

  const locales = await showLocalesService(Number.parseInt(category));

  reply.send({ data: locales });
};

const listSection = async (request: SectionRequest, reply: FastifyReply) => {
  const { localeId } = request.params;
  const { sectionName } = request.query;

  const sectionInfo = await listSectionService(localeId, sectionName);

  reply.send({ data: sectionInfo });
};

export default { showAll, listCategory, listSection };
