import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import localesController, {
  listOpts,
  listSectionOpts,
} from "@controllers/localesController";

const locales = async (app: FastifyInstance, options: FastifyPluginOptions) => {
  // app.get('/teste', (request, reply) => {
  //     reply.send({ teste: 'teste'});
  // });
  app.get("/locales/:categoryList", listOpts, localesController.list);
  app.get(
    "/locales/section/:localeId",
    listSectionOpts,
    localesController.listSection,
  );
};

export default locales;
