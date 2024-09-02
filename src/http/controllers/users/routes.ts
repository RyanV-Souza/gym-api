import { verifyJwt } from "@/http/middleware/verify-jwt";
import { authenticate } from "./authenticate";
import { profile } from "./profile";
import { register } from "./register";
import { FastifyInstance } from "fastify";
import { refresh } from "./refresh";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  app.patch("/token/refresh", refresh);

  // Authenticated routes
  app.get("/me", { onRequest: [verifyJwt] }, profile);
}
