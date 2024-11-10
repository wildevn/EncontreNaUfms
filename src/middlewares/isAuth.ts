import type { FastifyReply, FastifyRequest } from "fastify";
import verifyToken from "@/helpers/verifyToken";

const isAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  const { authorization } = request.headers;
  if (!authorization) {
    return reply.status(401).send({ error: "Not authenticated" });
  }

  const [_, token] = authorization.split(" ");
  const isValid = verifyToken(token, "access");
  if (!isValid) {
    return reply.status(401).send({ error: "Access token expired or invalid" });
  }
};

export default isAuth;
