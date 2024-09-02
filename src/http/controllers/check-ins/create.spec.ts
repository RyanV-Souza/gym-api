import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Create Check-In (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create check-in", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const { id } = await prisma.gym.create({
      data: {
        title: "Gym 1",
        description: "Description 1",
        phone: "123456789",
        latitude: -23.55,
        longitude: -46.66,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({ latitude: -23.55, longitude: -46.66 });

    expect(response.statusCode).toEqual(201);
  });
});
