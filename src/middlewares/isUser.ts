import type { FastifyReply, FastifyRequest } from "fastify";
import type { DeleteRequest, EditRequest } from "@/controllers/usersController";
import decodeToken from "@/helpers/decodeToken";

const isUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { authorization } = request.headers;
  let { userEmail } = request.params as DeleteRequest["Params"];
  if (!userEmail) {
    userEmail = request?.body
      ? (request.body as EditRequest["Body"]).email
      : "";
  }

  if (!authorization) {
    return reply.status(401).send({ error: "Not authenticated" });
  }

  if (userEmail) {
    const decodedToken: number | string = decodeToken(authorization, "email");

    if (typeof decodedToken === "number") {
      return reply.status(401).send({ error: "Invalid or expired token" });
    }

    if (
      decodedToken !== userEmail &&
      decodedToken !== process.env.ADMIN_EMAIL
    ) {
      return reply.status(401).send({
        error: "Cannot edit or delete a different user than the current one",
      });
    }
  }
};

export default isUser;
