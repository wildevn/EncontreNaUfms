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
import decodeToken from "@/helpers/decodeToken";
import createLocaleService, {
  type Result,
  type Locale,
} from "@/services/localesServices/createLocaleService";
import updateLocaleService, {
  type EditResult,
  type EditLocale,
} from "@/services/localesServices/updateLocaleService";
import deleteLocaleService from "@/services/localesServices/deleteLocaleService";
import verifyToken from "@/helpers/verifyToken";
import isAuth from "@/middlewares/isAuth";
import sendSuggestionEmail from "@/helpers/sendSuggestionEmail";
import getUserInfoService from "@/services/userServices/getUserInfoService";
// import updateLocaleService from "@/services/localesServices/UpdateLocaleService";
// import { request } from "node:http";

export type ListLocalesRequest = {
  Params: { categoryList: string };
  Querystring: { searchParam: string; pageNumber: string; limit: string };
};

export type SectionRequest = {
  Params: { localeId: string };
  Querystring: { sectionId: string };
};

export type InsertLocaleRequest = {
  Body: { locale: Locale };
};

export type EditLocaleRequest = {
  Params: { localeId: string };
  Body: { locale: EditLocale };
};

export type DeleteLocaleRequest = {
  Params: { localeId: string };
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
        searchParam: { type: "string" },
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
      required: ["localeId"],
      properties: {
        localeId: { type: "string" },
      },
    },
    querystring: {
      type: "object",
      required: ["sectionId"],
      properties: {
        sectionId: { type: "string" },
      },
    },
  },
};

export const insertLocaleOtps: RouteShorthandOptions = {
  schema: {
    headers: {
      type: "object",
      properties: {
        authorization: { type: "string" },
      },
    },
    body: {
      type: "object",
      required: ["locale"],
      properties: {
        locale: {
          type: "object",
          required: ["name", "address", "type"],
          properties: {
            // basic info for a locale
            name: { type: "string" },
            localizationLink: { type: "string" },
            latitude: { type: "string" },
            longitude: { type: "string" },
            address: { type: "string" },
            about: { type: "string" },
            observation: { type: "string" },
            type: { type: "number" },
            phoneNumber: { type: "string" },
            accessibility: { type: "boolean" },

            photos: {
              type: ["array", "null"],
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  data: { type: "string" },
                },
              },
            },

            schedule: {
              type: ["object", "null"],
              properties: {
                monday: { type: "string" },
                tuesday: { type: "string" },
                wednesday: { type: "string" },
                thursday: { type: "string" },
                friday: { type: "string" },
                saturday: { type: "string" },
                sunday: { type: "string" },
              },
            },

            // for specific types (AcademicBlocks, Libraries, Sports, Transports)
            specialInfo: {
              type: ["object", "null"],
              properties: {
                course: { type: "string" },
                libraryLink: { type: "string" },
                availableSports: { type: "string" },
                availableBuses: { type: "string" },
                rules: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
  preHandler: isAuth,
};

export const editLocaleOtps: RouteShorthandOptions = {
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
    body: {
      type: "object",
      required: ["locale"],
      properties: {
        locale: {
          type: ["object", "null"],
          properties: {
            // basic info for a locale
            name: { type: "string" },
            localizationLink: { type: "string" },
            latitude: { type: "string" },
            longitude: { type: "string" },
            address: { type: "string" },
            about: { type: "string" },
            observation: { type: "string" },
            type: { type: "number" },
            phoneNumber: { type: "string" },
            accessibility: { type: "boolean" },

            photos: {
              type: ["array", "null"],
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  data: { type: "string" },
                },
              },
            },

            schedule: {
              type: ["object", "null"],
              properties: {
                monday: { type: "string" },
                tuesday: { type: "string" },
                wednesday: { type: "string" },
                thursday: { type: "string" },
                friday: { type: "string" },
                saturday: { type: "string" },
                sunday: { type: "string" },
              },
            },

            // for specific types (AcademicBlocks, Libraries, Sports, Transports)
            specialInfo: {
              type: ["object", "null"],
              properties: {
                course: { type: "string" },
                libraryLink: { type: "string" },
                availableSports: { type: "string" },
                availableBuses: { type: "string" },
                rules: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
  preHandler: isAuth,
};

export const deleteLocaleOpts: RouteShorthandOptions = {
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
};

// continuar a função, finalizando
const list = async (
  request: FastifyRequest<ListLocalesRequest>,
  reply: FastifyReply,
) => {
  const { categoryList } = request.params;
  const { searchParam, pageNumber, limit } = request.query;
  let userId = 0;
  let isValid = -1;

  if ("authorization" in request.headers && request.headers.authorization) {
    const { authorization } = request.headers;
    userId = decodeToken(authorization) as number;
    isValid = userId ? 1 : 0;
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
      searchParam,
    );
    if ("error" in data) {
      return reply.status(400).send({ error: { message: data.error } });
    }

    return reply.status(isValid === 0 ? 401 : 200).send({ data });
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
  const { sectionId } = request.query;
  let userId = 0;
  let isValid = -1;

  if ("authorization" in request.headers && request.headers.authorization) {
    const { authorization } = request.headers;
    userId = decodeToken(authorization) as number;
    isValid = userId ? 1 : 0;
  }
  if (
    typeof localeId === "undefined" ||
    localeId === "0" ||
    Number.isNaN(Number.parseInt(localeId))
  ) {
    return reply
      .status(400)
      .send({ error: "Please provide a localeId in the query string" });
  }

  const sectionInfo = await listSectionService(
    Number.parseInt(localeId),
    userId,
    sectionId,
  );

  if (sectionInfo) {
    if ("error" in sectionInfo) {
      return reply
        .status(sectionInfo.status)
        .send({ error: sectionInfo.error });
    }
    return reply
      .status(isValid === 0 ? 401 : sectionInfo.status)
      .send({ data: sectionInfo.result });
  }
  return reply
    .status(500)
    .send({ error: "Inernal Server Error, please try again" });
};

const insert = async (
  request: FastifyRequest<InsertLocaleRequest>,
  reply: FastifyReply,
) => {
  const { locale } = request.body;
  const { authorization } = request.headers;
  let newLocale: Result;

  const userEmail: string = decodeToken(authorization || "", "email") as string;

  if (userEmail === process.env.ADMIN_EMAIL) {
    newLocale = await createLocaleService(locale);
  } else {
    const { user } = await getUserInfoService(userEmail);
    newLocale = await sendSuggestionEmail(
      locale,
      true,
      user?.email || "",
      user?.name || "",
    );
    return { status: 200, result: "email sent" };
  }

  if ("error" in newLocale) {
    return reply.status(newLocale.status).send({ error: newLocale.error });
  }
  return reply.status(newLocale.status).send({ data: newLocale.result });
};

const edit = async (
  request: FastifyRequest<EditLocaleRequest>,
  reply: FastifyReply,
) => {
  const { locale } = request.body;
  const { localeId } = request.params;
  const { authorization } = request.headers;

  const userEmail: string = decodeToken(authorization || "", "email") as string;
  let updatedLocale: EditResult;

  if (localeId) {
    if (userEmail === process.env.ADMIN_EMAIL) {
      updatedLocale = await updateLocaleService(
        locale,
        Number.parseInt(localeId),
      );
    } else {
      const { user } = await getUserInfoService(userEmail);
      updatedLocale = await sendSuggestionEmail(
        locale as Locale,
        true,
        user?.email || "",
        user?.name || "",
      );
    }

    if ("error" in updatedLocale) {
      return reply
        .status(updatedLocale.status)
        .send({ error: updatedLocale.error });
    }
    return reply
      .status(updatedLocale.status)
      .send({ data: updatedLocale.result });
  }
  return reply.status(400).send({ error: "required parameter: localeId" });
};

const deleteById = async (
  request: FastifyRequest<DeleteLocaleRequest>,
  reply: FastifyReply,
) => {
  const { localeId } = request.params;
  if (localeId) {
    const deletedLocale: Result = await deleteLocaleService(
      Number.parseInt(localeId),
    );

    if ("error" in deletedLocale) {
      return reply
        .status(deletedLocale.status)
        .send({ error: deletedLocale.error });
    }
    return reply
      .status(deletedLocale.status)
      .send({ data: deletedLocale.result });
  }
  return reply.status(400).send({ error: "required parameter: localeId" });
};

export default { list, listSection, insert, edit, deleteById };
