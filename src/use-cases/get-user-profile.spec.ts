import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("get user profile use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able to get user profile", async () => {
    const { id } = await usersRepository.create({
      name: "John Doe",
      email: "john@doe.com",
      password_hash: await hash("123456", 10),
    });

    const { user } = await sut.execute({
      userId: id,
    });

    expect(user.name).toBe("John Doe");
  });

  it("should not be able to get user profile with wrong id", async () => {
    await expect(
      sut.execute({
        userId: "wrong-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
