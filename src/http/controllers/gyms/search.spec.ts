import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to search gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym 1",
        description: "Description 1",
        phone: "123456789",
        latitude: -23.55,
        longitude: -46.66,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym 2",
        description: "Description 2",
        phone: "123456789",
        latitude: -23.55,
        longitude: -46.66,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .set("Authorization", `Bearer ${token}`)
      .query({ q: "1" });

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Gym 1",
      }),
    ]);
  });
});
