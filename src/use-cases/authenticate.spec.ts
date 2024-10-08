import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("authenticate use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to authenticate", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "john@doe.com",
      password_hash: await hash("123456", 10),
    });

    const { user } = await sut.execute({
      email: "john@doe.com",
      password: "123456",
    });

    expect(user.id).toBeDefined();
  });

  it("should not be able to authenticate with wrong email", async () => {
    await expect(
      sut.execute({
        email: "wrong@email.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "john@doe.com",
      password_hash: await hash("123456", 10),
    });

    await expect(
      sut.execute({
        email: "john@doe.com",
        password: "wrong-password",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
