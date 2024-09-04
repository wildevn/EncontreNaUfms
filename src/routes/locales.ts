import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import localesController, {
  listCategoryOpts,
  listSectionOpts,
} from "@controllers/localesController";

const locales = async (app: FastifyInstance, options: FastifyPluginOptions) => {
  // app.get('/teste', (request, reply) => {
  //     reply.send({ teste: 'teste'});
  // });
  app.get("/locales/all", localesController.showAll);
  app.get(
    "/locales/category/:category",
    listCategoryOpts,
    localesController.listCategory,
  );
  app.get(
    "/locales/section/:localeId",
    listSectionOpts,
    localesController.listSection,
  );
};

export default locales;
