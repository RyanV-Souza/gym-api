import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("check in use case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "1",
      title: "Gym 1",
      latitude: -24.0803549,
      longitude: -46.5886484,
      phone: "+551199999999",
      description: null,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      userId: "1",
      gymId: "1",
      userLatitude: -24.0803549,
      userLongitude: -46.5886484,
    });

    expect(checkIn.id).toBeDefined();
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 8, 0, 0));

    await sut.execute({
      userId: "1",
      gymId: "1",
      userLatitude: -24.0803549,
      userLongitude: -46.5886484,
    });

    await expect(
      sut.execute({
        userId: "1",
        gymId: "1",
        userLatitude: -24.0803549,
        userLongitude: -46.5886484,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should not be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 8, 0, 0));

    await sut.execute({
      userId: "1",
      gymId: "1",
      userLatitude: -24.0803549,
      userLongitude: -46.5886484,
    });

    vi.setSystemTime(new Date(2023, 0, 2, 8, 0, 0));

    await expect(
      sut.execute({
        userId: "1",
        gymId: "1",
        userLatitude: -24.0803549,
        userLongitude: -46.5886484,
      }),
    ).resolves.toBeDefined();
  });

  it("should not be able to check in on distant gym", async () => {
    await gymsRepository.create({
      id: "2",
      title: "Gym 2",
      latitude: -23.8776068,
      longitude: -46.186831,
      phone: "+551199999999",
      description: null,
    });

    await expect(
      sut.execute({
        userId: "1",
        gymId: "2",
        userLatitude: -24.0803549,
        userLongitude: -46.5886484,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
