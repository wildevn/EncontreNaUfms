import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import usersController, {
  editOpts,
  userInfoOpts,
  type EditRequest,
  type InfoRequest,
} from "@controllers/usersController";

const users = async (app: FastifyInstance, options: FastifyPluginOptions) => {
  app.post<EditRequest>("/users/edit", editOpts, usersController.edit);
  app.get<InfoRequest>("/users/:userId", userInfoOpts, usersController.info);
};

export default users;
