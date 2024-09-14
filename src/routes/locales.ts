import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import localesController, {
  listOpts,
  listSectionOpts,
  type ListLocalesRequest,
  type SectionRequest,
} from "@controllers/localesController";

const locales = async (app: FastifyInstance, options: FastifyPluginOptions) => {
  app.get<ListLocalesRequest>(
    "/locales/:categoryList",
    listOpts,
    localesController.list,
  );
  app.get<SectionRequest>(
    "/locales/section/:localeId",
    listSectionOpts,
    localesController.listSection,
  );
};

export default locales;
