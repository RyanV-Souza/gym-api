import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const { gymId } = createCheckInParamsSchema.parse(request.params);

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  });

  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

  const { sub } = request.user;

  const useCase = makeCheckInUseCase();

  await useCase.execute({
    gymId,
    userLatitude: latitude,
    userLongitude: longitude,
    userId: sub,
  });

  return reply.status(201).send();
}
