import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import reviewsController, {
  type CreateOrUpdateRequest,
  type GetReviewRequest,
  type DeleteByIdRequest,
  createOrUpdateOtps,
  getReviewOtps,
  deleteByIdOtps,
} from "@/controllers/reviewsController";

const reviews = async (app: FastifyInstance, options: FastifyPluginOptions) => {
  app.post<CreateOrUpdateRequest>(
    "/reviews/:localeId",
    createOrUpdateOtps,
    reviewsController.createOrUpdate,
  );
  app.get<GetReviewRequest>(
    "/reviews/:localeId",
    getReviewOtps,
    reviewsController.getReview,
  );
  app.delete<DeleteByIdRequest>(
    "/reviews/:localeId",
    deleteByIdOtps,
    reviewsController.deleteById,
  );
};

export default reviews;
