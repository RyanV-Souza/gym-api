import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists";

describe("register use case", () => {
  it("should hash user password", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "john@doe.com",
      password: "123456",
    });

    const isPasswordHashed = await compare("123456", user.password_hash);

    expect(isPasswordHashed).toBe(true);
  });

  it("should not be able to register user with same email twice", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    await registerUseCase.execute({
      name: "John Doe",
      email: "john@doe.com",
      password: "123456",
    });

    await expect(
      registerUseCase.execute({
        name: "John Doe",
        email: "john@doe.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
