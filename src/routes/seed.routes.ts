import express from "express";
import { SeedController } from "../controllers/seed.controller";
import { authenticate } from "../middleware/authentication";
import { authorization } from "../middleware/authorization";
import { roles } from "../types/index.types";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorization([roles.admin]),
  SeedController.registerSeed
);
router.patch(
  "/:id",
  authenticate,
  authorization([roles.admin]),
  SeedController.updateSeed
);
router.get("/all", SeedController.getSeeds);
router.get("/:id", SeedController.getSeed);
router.delete(
  "/:id",
  authenticate,
  authorization([roles.admin]),
  SeedController.getSeed
);

export default router;
