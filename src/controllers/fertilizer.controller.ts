import { Request, Response } from "express";
import cache from "memory-cache";
import AppDataSource from "../data-source";
import { Fertilizer } from "../entity/Fertilizer.entity";
import {
  HTTP_CREATED,
  HTTP_NOT_FOUND,
  HTTP_OK,
} from "../constants/httpStatusCode";
import { TIME_OUT_LIMIT } from "../constants/general";

export class FertilizerController {
  static async registerFertilizer(req: Request, res: Response) {
    const { name, description, price } = req.body;
    const fertilizer = new Fertilizer();
    fertilizer.name = name;
    fertilizer.description = description;
    fertilizer.price = price;
    const fertilizerRepo = AppDataSource.getRepository(Fertilizer);
    await fertilizerRepo.save(fertilizer);

    return res.status(HTTP_CREATED).json({
      message: "Fertilizer registered successfully",
      data: fertilizer,
    });
  }

  static async updateFertilizer(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const fertilizerRepo = AppDataSource.getRepository(Fertilizer);
    const existingFertilizer = await fertilizerRepo.findOne({ where: { id } });
    if (existingFertilizer === null) {
      return res
        .status(HTTP_NOT_FOUND)
        .json({ message: `Fertilizer with ${id} is not found` });
    }
    existingFertilizer!.name = name;
    existingFertilizer!.description = description;
    existingFertilizer!.price = price;

    await fertilizerRepo.save(existingFertilizer);

    return res.status(HTTP_OK).json({
      message: "Fertilizer updated successfully",
      data: existingFertilizer,
    });
  }

  static async getFertilizer(req: Request, res: Response) {
    const { id } = req.params;
    const fertilizerRepo = AppDataSource.getRepository(Fertilizer);
    const fertilizer = await fertilizerRepo.findOne({ where: { id } });
    if (fertilizer === null) {
      return res
        .status(HTTP_NOT_FOUND)
        .json({ message: `Fertilizer with ${id} is not found` });
    }
    return res
      .status(HTTP_OK)
      .json({ message: "Fertilizer retrieved successfully", data: fertilizer });
  }

  static async getFertilizers(_: Request, res: Response) {
    const cachedData = cache.get("fertilizers");
    if (cachedData) {
      console.log("Returning cached data");
      return res.status(HTTP_OK).json({
        message: "Fertilizers retrieved successfully",
        data: cachedData,
      });
    }
    console.log("Returning data from DB");
    const fertilizerRepo = AppDataSource.getRepository(Fertilizer);
    const fertilizers = await fertilizerRepo.find();
    cache.put("fertilizers", fertilizers, TIME_OUT_LIMIT);
    return res.status(HTTP_OK).json({
      message: "Fertilizers retrieved successfully",
      data: fertilizers,
    });
  }

  static async deleteFertilizer(req: Request, res: Response) {
    const { id } = req.params;
    const fertilizerRepo = AppDataSource.getRepository(Fertilizer);
    const existingFertilizer = await fertilizerRepo.findOne({ where: { id } });
    if (existingFertilizer === null) {
      return res
        .status(HTTP_NOT_FOUND)
        .json({ message: `Fertilizer with ${id} is not found` });
    }
    await fertilizerRepo.remove(existingFertilizer);
    return res.status(HTTP_OK).json({
      message: "Fertilizer deleted successfully",
      data: existingFertilizer,
    });
  }
}
