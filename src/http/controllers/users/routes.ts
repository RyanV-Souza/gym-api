import { verifyJwt } from "@/http/middleware/verify-jwt";
import { authenticate } from "./authenticate";
import { profile } from "./profile";
import { register } from "./register";
import { FastifyInstance } from "fastify";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  // Authenticated routes
  app.get("/me", { onRequest: [verifyJwt] }, profile);
}
