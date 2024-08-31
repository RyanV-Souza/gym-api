import { expect, describe, it, beforeEach, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { FetchUserCheckInsHistory } from "./fetch-user-check-ins-history";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistory;

describe("fetch user check-ins history use case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsHistory(checkInsRepository);
  });

  afterEach(() => {});

  it("should be able to fetch user check-ins history", async () => {
    await checkInsRepository.create({
      user_id: "1",
      gym_id: "1",
    });

    await checkInsRepository.create({
      user_id: "1",
      gym_id: "2",
    });

    const { checkIns } = await sut.execute({
      userId: "1",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "1" }),
      expect.objectContaining({ gym_id: "2" }),
    ]);
  });

  it("should be able to fetch paginated user check-ins history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        user_id: "1",
        gym_id: i.toString(),
      });
    }

    const { checkIns } = await sut.execute({
      userId: "1",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "21" }),
      expect.objectContaining({ gym_id: "22" }),
    ]);
  });
});
