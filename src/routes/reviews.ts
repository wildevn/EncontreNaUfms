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
    "/reviews/createOrUpdate/:localeId",
    createOrUpdateOtps,
    reviewsController.createOrUpdate,
  );
  app.get<GetReviewRequest>(
    "/reviews/get/:localeId",
    getReviewOtps,
    reviewsController.getReview,
  );
  app.delete<DeleteByIdRequest>(
    "/reviews/delete/:localeId",
    deleteByIdOtps,
    reviewsController.deleteById,
  );
};

export default reviews;
