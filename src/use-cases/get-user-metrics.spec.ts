import { expect, describe, it, beforeEach, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("get user metrics use case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  afterEach(() => {});

  it("should be able to get check-ins count from metrics", async () => {
    await checkInsRepository.create({
      user_id: "1",
      gym_id: "1",
    });

    await checkInsRepository.create({
      user_id: "1",
      gym_id: "2",
    });

    const { checkInsCount } = await sut.execute({
      userId: "1",
    });

    expect(checkInsCount).toEqual(2);
  });
});
