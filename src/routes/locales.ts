import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import localesController, {
  listOpts,
  listSectionOpts,
  insertLocaleOtps,
  editLocaleOtps,
  deleteLocaleOpts,
  type ListLocalesRequest,
  type SectionRequest,
  type InsertLocaleRequest,
  type EditLocaleRequest,
  type DeleteLocaleRequest,
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

  app.post<InsertLocaleRequest>(
    "/locales/new",
    insertLocaleOtps,
    localesController.insert,
  );
  app.put<EditLocaleRequest>(
    "/locales/edit/:localeId",
    editLocaleOtps,
    localesController.edit,
  );
  app.delete<DeleteLocaleRequest>(
    "/locales/delete/:localeId",
    deleteLocaleOpts,
    localesController.deleteById,
  );

  app.register(favorites, { prefix: "/locales" });
  app.register(reviews, { prefix: "/locales" });
};

export default locales;
