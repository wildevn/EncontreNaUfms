import type { FastifyReply, FastifyRequest } from "fastify";
import verifyToken from "@/helpers/verifyToken";
import type { DeleteRequest } from "@/controllers/usersController";
import decodeToken from "@/helpers/decodeToken";

const isUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { authorization } = request.headers;
  const { userEmail } = request.params as DeleteRequest["Params"];

  if (!authorization) {
    return reply.status(401).send({ error: "Not authenticated" });
  }

  if (userEmail) {
    const decodedToken: number | string = decodeToken(authorization, "email");

    if (typeof decodedToken === "number") {
      return reply.status(401).send({ error: "Invalid or expired token" });
    }

    if (decodedToken !== userEmail) {
      return reply
        .status(401)
        .send({ error: "Cannot delete a different user than yours" });
    }
  }
};

export default isUser;
