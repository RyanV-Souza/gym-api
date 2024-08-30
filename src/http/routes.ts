import { authenticate } from "./controllers/authenticate";
import { register } from "./controllers/register";
import { FastifyInstance } from "fastify";

export async function appRoutes(app: FastifyInstance) {
  app.post("/user", register);
  app.post("/session", authenticate);
}
