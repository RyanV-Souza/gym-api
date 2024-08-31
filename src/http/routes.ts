import { authenticate } from "./controllers/authenticate";
import { profile } from "./controllers/profile";
import { register } from "./controllers/register";
import { FastifyInstance } from "fastify";
import { verifyJwt } from "./middleware/verify-jwt";

export async function appRoutes(app: FastifyInstance) {
  app.post("/user", register);
  app.post("/session", authenticate);

  // Authenticated routes
  app.get("/me", { onRequest: [verifyJwt] }, profile);
}
