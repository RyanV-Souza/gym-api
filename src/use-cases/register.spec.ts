import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";

describe("register use case", () => {
  it("should hash user password", async () => {
    const registerUseCase = new RegisterUseCase({
      findByEmail: async () => null,

      create: async (data) => {
        return {
          id: "1",
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        };
      },
    });

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "john@doe.com",
      password: "123456",
    });

    const isPasswordHashed = await compare("123456", user.password_hash);

    expect(isPasswordHashed).toBe(true);
  });
});
