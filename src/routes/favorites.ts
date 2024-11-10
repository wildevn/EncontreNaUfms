import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import favoritesController, {
  changeOtps,
  type ChangeRequest,
} from "@controllers/favoritesController";

const favorites = async (
  app: FastifyInstance,
  options: FastifyPluginOptions,
) => {
  app.post<ChangeRequest>(
    "/favorites/:localeId",
    changeOtps,
    favoritesController.change,
  );
};

export default favorites;
