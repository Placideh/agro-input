import { Request, Response } from "express";
import cache from "memory-cache";
import AppDataSource from "../data-source";
import {
  HTTP_CREATED,
  HTTP_NOT_FOUND,
  HTTP_OK,
} from "../constants/httpStatusCode";
import { Fertilizer } from "../entity/Fertilizer.entity";
import { Seed } from "../entity/Seed.entity";
import { TIME_OUT_LIMIT } from "../constants/general";

export class SeedController {
  static async registerSeed(req: Request, res: Response) {
    const { name, description, price, fertilizerId } = req.body;

    const fertilizerRepo = AppDataSource.getRepository(Fertilizer);
    const existingFertilizer = await fertilizerRepo.findOne({
      where: { id: fertilizerId },
    });

    if (existingFertilizer === null) {
      return res.status(HTTP_NOT_FOUND).json({
        message: `Fertilizer ${fertilizerId} is not found`,
      });
    }

    const seed = new Seed();
    seed.name = name;
    seed.description = description;
    seed.price = price;
    seed.fertilizer = existingFertilizer;
    const seedRepo = AppDataSource.getRepository(Seed);
    await seedRepo.save(seed);
    return res.status(HTTP_CREATED).json({
      message: "Seed registered successfully",
      data: seed,
    });
  }

  static async updateSeed(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, price, fertilizerId } = req.body;

    const seedRepo = AppDataSource.getRepository(Seed);
    const existingSeed = await seedRepo.findOne({
      where: { id: id },
    });

    if (existingSeed === null) {
      return res.status(HTTP_NOT_FOUND).json({
        message: `Seed with ${id} is not found`,
      });
    }

    // Update seed
    existingSeed.name = name;
    existingSeed.description = description;
    existingSeed.price = price;

    if (existingSeed.fertilizer!.id !== fertilizerId) {
      const fertilizerRepo = AppDataSource.getRepository(Fertilizer);
      const existingFertilizer = await fertilizerRepo.findOne({
        where: { id: fertilizerId },
      });
      existingSeed.fertilizer = existingFertilizer!;
    }
    await seedRepo.save(existingSeed);

    return res.status(HTTP_OK).json({
      message: "Seed updated successfully",
      data: existingSeed,
    });
  }

  static async getSeed(req: Request, res: Response) {
    const { id } = req.params;

    const seedRepo = AppDataSource.getRepository(Seed);
    const existingSeed = await seedRepo.findOne({
      where: { id: id },
    });

    if (existingSeed === null) {
      return res.status(HTTP_NOT_FOUND).json({
        message: `Seed with ${id} is not found`,
      });
    }
    return res.status(HTTP_OK).json({
      message: `Seed with ${id} retrieved successfully`,
      data: existingSeed,
    });
  }

  static async getSeeds(_: Request, res: Response) {
    const cachedData = cache.get("seeds");
    if (cachedData) {
      console.log("Returning cached seeds");
      return res
        .status(HTTP_OK)
        .json({ message: "Seeds retrieved successfully", data: cachedData });
    }
    console.log("Fetching seeds from database");

    const seedRepo = AppDataSource.getRepository(Seed);
    const seeds = await seedRepo.find();
    cache.put("seeds", seeds, TIME_OUT_LIMIT);
    return res.status(HTTP_OK).json({
      message: "Seeds retrieved successfully",
      data: seeds,
    });
  }

  static async deleteSeed(req: Request, res: Response) {
    const { id } = req.params;

    const seedRepo = AppDataSource.getRepository(Seed);
    const existingSeed = await seedRepo.findOne({
      where: { id: id },
    });

    if (existingSeed === null) {
      return res.status(HTTP_NOT_FOUND).json({
        message: `Seed with ${id} is not found`,
      });
    }

    await seedRepo.remove(existingSeed);

    return res.status(HTTP_OK).json({
      message: "Seed deleted successfully",
      data: existingSeed,
    });
  }
}
