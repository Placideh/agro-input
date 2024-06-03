import express from "express";
import { OrderController } from "../controllers/order.controller";

const router = express.Router();

router.post("/", OrderController.requestOrder);
router.patch("/:id", OrderController.updateOrder);
router.get("/all", OrderController.getAllOrders);
router.get("/paginate", OrderController.getAllOrders);
router.get("/:id", OrderController.getOrder);
router.get("/email", OrderController.getOrderByUserEmail);
router.delete("/:id", OrderController.deleteOrder);

export default router;
