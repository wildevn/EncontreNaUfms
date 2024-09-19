import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import favoritesController, {
  // listOtps,
  changeOtps,
  type ChangeRequest,
} from "@controllers/favoritesController";

const favorites = async (
  app: FastifyInstance,
  options: FastifyPluginOptions,
) => {
  // app.get("/favorites/", listOtps, favoritesController.list);
  app.post<ChangeRequest>(
    "/favorites/:localeId",
    changeOtps,
    favoritesController.change,
  );
};

export default favorites;
