import express from "express";
import { FertilizerController } from "../controllers/fertilizer.controller";

const router = express.Router();

router.post("/", FertilizerController.registerFertilizer);
router.patch("/:id", FertilizerController.updateFertilizer);
router.get("/all", FertilizerController.getFertilizers);
router.get("/:id", FertilizerController.getFertilizer);
router.delete("/:id", FertilizerController.deleteFertilizer);

export default router;
