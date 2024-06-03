import { Request, Response } from "express";
import cache from "memory-cache";
import AppDataSource from "../data-source";
import { Order } from "../entity/Order.entity";
import {
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_NOT_FOUND,
  HTTP_OK,
} from "../constants/httpStatusCode";
import { TIME_OUT_LIMIT } from "../constants/general";
import { calculateSeedQuantiy } from "../helpers/shared/seed.helper";
import { calculateFertilizerQuantiy } from "../helpers/shared/fertilizer.helper";
import { Seed } from "../entity/Seed.entity";
import { OrderStatus } from "../types/index.types";

export class OrderController {
  static async requestOrder(req: Request, res: Response) {
    const { landSize, farmerEmail, farmerName, seedId, paymentMethod } =
      req.body.data;
    const fertilizerQuantity = calculateFertilizerQuantiy(parseFloat(landSize));
    const seedQuantity = calculateSeedQuantiy(parseFloat(landSize));

    const seedRepo = AppDataSource.getRepository(Seed);
    const existingSeed = await seedRepo.findOne({ where: { id: seedId } });
    if (existingSeed === null) {
      return res.status(HTTP_NOT_FOUND).json({
        message: `Seed ${seedId} is not found`,
      });
    }
    if (parseFloat(landSize) <= 0) {
      return res.status(HTTP_BAD_REQUEST).json({
        message: `Land size must not equal to zero or less`,
      });
    }
    const order = new Order();
    order.seedQuantity = seedQuantity;
    order.fertilizerQuantity = fertilizerQuantity;
    order.landSize = parseFloat(landSize);
    order.farmerEmail = farmerEmail;
    order.farmerName = farmerName;
    order.seed = existingSeed;
    order.status = OrderStatus.initiated;
    order.paymentMethod = paymentMethod || "MOMO";

    // calculate amount to be paid
    const seedAmountToPaid =
      parseFloat(existingSeed.price?.toString()!) * seedQuantity;

    const fertilizerAmountToPaid =
      parseFloat(existingSeed.fertilizer?.price?.toString()!) *
      fertilizerQuantity;

    const amountTobePaid = seedAmountToPaid + fertilizerAmountToPaid;

    order.amount = amountTobePaid;
    const orderRepo = AppDataSource.getRepository(Order);
    await orderRepo.save(order);
    return res.status(HTTP_CREATED).json({
      message: `Order requested successfully`,
      data: order,
    });
  }

  static async updateOrder(req: Request, res: Response) {
    const { id } = req.params;
    const { famerEmail, farmerName, paymentMethod, status } = req.body;
    console.log("BODY:", req.body);
    const orderRepo = AppDataSource.getRepository(Order);
    const existingOrder = await orderRepo.findOne({ where: { id } });
    if (existingOrder === null) {
      return res.status(HTTP_NOT_FOUND).json({
        message: `Order ${id} is not found`,
      });
    }

    // update order
    existingOrder.status = status;
    existingOrder.farmerEmail = famerEmail;
    existingOrder.farmerName = farmerName;
    existingOrder.paymentMethod = paymentMethod;

    await orderRepo.save(existingOrder);
    // send email notification for the order status
    return res.status(HTTP_OK).json({
      message: `Order ${id} is updated successfully`,
      data: existingOrder,
    });
  }

  static async getOrder(req: Request, res: Response) {
    const { id } = req.params;

    const orderRepo = AppDataSource.getRepository(Order);
    const existingOrder = await orderRepo.findOne({ where: { id } });
    if (existingOrder === null) {
      return res.status(HTTP_NOT_FOUND).json({
        message: `Order ${id} is not found`,
      });
    }
    return res.status(HTTP_OK).json({
      message: `Order with ${id} retrieved successfully`,
      data: existingOrder,
    });
  }

  static async getOrderByUserEmail(req: Request, res: Response) {
    const { farmerEmail } = req.body;

    const orderRepo = AppDataSource.getRepository(Order);
    const existingOrder = await orderRepo
      .createQueryBuilder("orders")
      .where("orders.farmerEmail = :farmerEmail", { farmerEmail })
      .getMany();

    if (existingOrder === null) {
      return res.status(HTTP_NOT_FOUND).json({
        message: `Order with ${farmerEmail} is not found`,
      });
    }

    return res.status(HTTP_OK).json({
      message: `Order with ${farmerEmail} retrieved successfully`,
      data: existingOrder,
    });
  }

  static async getAllOrders(_: Request, res: Response) {
    console.log("Fetching orders from database");
    const orderRepo = AppDataSource.getRepository(Order);
    const orders = await orderRepo.find();
    cache.put("orders", orders, TIME_OUT_LIMIT);
    return res.status(HTTP_OK).json({
      message: "Orders retrieved successfully",
      data: orders,
    });
  }

  static async paginateOrders(req: Request, res: Response) {
    const builder =
      AppDataSource.getRepository(Order).createQueryBuilder("orders");
    const page: number = parseInt(req.query.page as string) || 5;
    const perPage = 5;
    builder.offset((page - 1) * perPage).limit(perPage);
    console.log("Fetching orders from database");
    const orders = await builder.getMany();
    return res.status(HTTP_OK).json({
      message: "Orders retrieved successfully",
      data: orders,
    });
  }

  static async deleteOrder(req: Request, res: Response) {
    const { id } = req.params;

    const orderRepo = AppDataSource.getRepository(Order);
    const existingOrder = await orderRepo.findOne({ where: { id } });
    if (existingOrder === null) {
      return res.status(HTTP_NOT_FOUND).json({
        message: `Order ${id} is not found`,
      });
    }

    await orderRepo.remove(existingOrder);
    return res.status(HTTP_OK).json({
      message: `Order ${id} is deleted successfully`,
      data: existingOrder,
    });
  }
}
