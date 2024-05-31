import { Request, Response } from "express";
import cache from "memory-cache";
import AppDataSource from "../data-source";
import { Order } from "../entity/Order.entity";
import {
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
      req.body;
    const fertilizerQuantity = calculateFertilizerQuantiy(landSize);
    const seedQuantity = calculateSeedQuantiy(landSize);

    const seedRepo = AppDataSource.getRepository(Seed);
    const existingSeed = await seedRepo.findOne({ where: { id: seedId } });
    if (existingSeed === null) {
      return res.status(HTTP_NOT_FOUND).json({
        message: `Seed ${seedId} is not found`,
      });
    }
    const order = new Order();
    order.seedQuantity = seedQuantity;
    order.fertilizerQuantity = fertilizerQuantity;
    order.landSize = landSize;
    order.farmerEmail = farmerEmail;
    order.farmerName = farmerName;
    order.seed = existingSeed;
    order.status = OrderStatus.pending;
    order.paymentMethod = paymentMethod;

    // calculate amount to be paid
    const seedAmountToPaid = existingSeed.price! * seedQuantity;

    const fertilizerAmountToPaid =
      existingSeed.fertilizer?.price! * fertilizerQuantity;

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

    const orderRepo = AppDataSource.getRepository(Order);
    const existingOrder = await orderRepo.findOne({ where: { id } });
    if (existingOrder === null) {
      return res.status(HTTP_NOT_FOUND).json({
        message: `Order ${id} is not found`,
      });
    }

    // update order
    existingOrder.status =
      status.toLowerCase() === OrderStatus.rejected
        ? OrderStatus.rejected
        : OrderStatus.approved;
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
    const cachedData = cache.get("orders");
    if (cachedData) {
      console.log("Returning cached seeds");
      return res.status(HTTP_OK).json({
        message: "Orders retrieved successfully",
        data: cachedData,
      });
    }
    console.log("Fetching orders from database");
    const orderRepo = AppDataSource.getRepository(Order);
    const orders = await orderRepo.find();
    cache.put("orders", orders, TIME_OUT_LIMIT);
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
