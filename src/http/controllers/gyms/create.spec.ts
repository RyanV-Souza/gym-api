import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym 1",
        description: "Description 1",
        phone: "123456789",
        latitude: -23.55,
        longitude: -46.66,
      });

    expect(response.statusCode).toEqual(201);
  });
});
