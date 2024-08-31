import { expect, describe, it, beforeEach, afterEach } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("fetch nearby gyms use case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  afterEach(() => {});

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym 1",
      description: "Description 1",
      phone: "123456789",
      latitude: -24.0803549,
      longitude: -46.5886484,
    });

    await gymsRepository.create({
      title: "Far Gym 2",
      description: "Description 2",
      phone: "123456789",
      latitude: -23.8776068,
      longitude: -46.186831,
    });

    const { gyms } = await sut.execute({
      userLatitude: -24.0803549,
      userLongitude: -46.5886484,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym 1" })]);
  });
});
