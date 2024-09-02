import { verifyJwt } from "@/http/middleware/verify-jwt";
import { FastifyInstance } from "fastify";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJwt);
}
