import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe("register use case", () => {
  it("should be able to register", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new RegisterUseCase(usersRepository);

    const { user } = await sut.execute({
      name: "John Doe",
      email: "john@doe.com",
      password: "123456",
    });

    expect(user.id).toBeDefined();
  });

  it("should hash user password", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new RegisterUseCase(usersRepository);

    const { user } = await sut.execute({
      name: "John Doe",
      email: "john@doe.com",
      password: "123456",
    });

    const isPasswordHashed = await compare("123456", user.password_hash);

    expect(isPasswordHashed).toBe(true);
  });

  it("should not be able to register user with same email twice", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new RegisterUseCase(usersRepository);

    await sut.execute({
      name: "John Doe",
      email: "john@doe.com",
      password: "123456",
    });

    await expect(
      sut.execute({
        name: "John Doe",
        email: "john@doe.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
