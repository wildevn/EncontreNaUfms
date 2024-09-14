import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import usersController, {
  createOrEditOpts,
  userInfoOpts,
  type CreateOrEditRequest,
  type InfoRequest,
} from "@controllers/usersController";

const users = async (app: FastifyInstance, options: FastifyPluginOptions) => {
  app.post<CreateOrEditRequest>(
    "/users/createOrEdit",
    createOrEditOpts,
    usersController.createOrEdit,
  );
  app.get<InfoRequest>("/users/:userId", userInfoOpts, usersController.info);
  // app.post("/users/login", usersController.login);
};

export default users;
