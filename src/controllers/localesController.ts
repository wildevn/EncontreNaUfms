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

type ListLocalesRequest = FastifyRequest<{
  Params: { categoryList: string };
  Querystring: { pageNumber: string; limit: string; userId: string };
}>;

type SectionRequest = FastifyRequest<{
  Params: { localeId: string };
  Querystring: { sectionName: string };
}>;

export const listOpts: RouteShorthandOptions = {
  schema: {
    params: {
      type: "object",
      required: ["categoryList"],
      properties: {
        category: { type: "string" },
      },
    },
    querystring: {
      type: "object",
      required: ["pageNumber", "limit", "userId"],
      properties: {
        pageNumber: { type: "string" },
        limit: { type: "string" },
        userId: { type: "string" },
      },
    },
  },
};

export const listSectionOpts: RouteShorthandOptions = {
  schema: {
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
const list = async (request: ListLocalesRequest, reply: FastifyReply) => {
  const { categoryList } = request.params;
  const { pageNumber, limit, userId } = request.query;

  if (pageNumber && limit && userId) {
    const parsedCategoryList: Array<string> =
      categoryList !== "" && categoryList.includes(",")
        ? categoryList.split(",")
        : categoryList === ""
          ? []
          : [categoryList];

    const data: Data | LocaleError = await showLocalesService(
      Number.parseInt(pageNumber),
      Number.parseInt(limit),
      Number.parseInt(userId),
      parsedCategoryList,
    );
    if ("error" in data) {
      return reply.status(400).send({ error: { message: data.error } });
    }
    return reply.status(200).send({ data });
  }
  const message: string = `Check parameter(s): ${pageNumber ? "" : "pageNumber,"} 
                            ${limit ? "" : "limit,"} ${userId ? "" : "userId"}`;
  return reply.status(400).send({ error: { message } });
};

const listSection = async (request: SectionRequest, reply: FastifyReply) => {
  const { localeId } = request.params;
  const { sectionName } = request.query;

  const sectionInfo = await listSectionService(localeId, sectionName);

  return reply.status(200).send({ data: sectionInfo });
};

export default { list, listSection };
