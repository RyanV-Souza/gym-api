import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("register (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should register a user", async () => {
    const response = await request(app.server).post("/users").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password",
    });

    expect(response.statusCode).toEqual(201);
  });
});
