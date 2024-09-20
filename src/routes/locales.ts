import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import localesController, {
  listOpts,
  listSectionOpts,
  type ListLocalesRequest,
  type SectionRequest,
} from "@controllers/localesController";
import favorites from "./favorites";
import reviews from "./reviews";

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
  app.register(favorites, { prefix: "/locales" });
  app.register(reviews, { prefix: "/locales" });
};

export default locales;
