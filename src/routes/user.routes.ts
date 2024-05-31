import express from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middleware/authentication";
import { authorization } from "../middleware/authorization";
import { roles } from "../types/index.types";

const router = express.Router();

router.post("/", UserController.registerUser);
router.get(
  "/:id",
  authenticate,
  authorization([roles.admin]),
  UserController.getUser
);

export default router;
