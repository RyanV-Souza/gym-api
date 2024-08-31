import { expect, describe, it, beforeEach, afterEach } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("search gyms use case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  afterEach(() => {});

  it("should be able to search for gyms", async () => {
    await gymsRepository.create({
      title: "Gym 1",
      description: "Description 1",
      phone: "123456789",
      latitude: -23.55,
      longitude: -46.66,
    });

    await gymsRepository.create({
      title: "Gym 2",
      description: "Description 2",
      phone: "123456789",
      latitude: -23.55,
      longitude: -46.66,
    });

    const { gyms } = await sut.execute({
      query: "1",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Gym 1" })]);
  });

  it.skip("should be able to fetch paginated gym search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: "Gym " + i,
        description: "Description 1",
        phone: "123456789",
        latitude: -23.55,
        longitude: -46.66,
      });
    }

    const { gyms } = await sut.execute({
      query: "Gym",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Gym 21" }),
      expect.objectContaining({ title: "Gym 22" }),
    ]);
  });
});
