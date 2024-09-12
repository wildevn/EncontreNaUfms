import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import usersController, {
  createOrEditOpts,
  userInfoOpts,
} from "@controllers/usersController";

const users = async (app: FastifyInstance, options: FastifyPluginOptions) => {
  app.post(
    "/users/createOrEdit",
    createOrEditOpts,
    usersController.createOrEdit,
  );
  app.get("/users/:userId", userInfoOpts, usersController.info);
  // app.post("/users/login", usersController.login);
};

export default users;
