import express from "express";
import fertilizerRouter from "./routes/fertilizer.routes";
import seedRouter from "./routes/seed.routes";
import orderRouter from "./routes/order.routes";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
const router = express.Router();

router.use("/fertilizer", fertilizerRouter);
router.use("/seed", seedRouter);
router.use("/order", orderRouter);
router.use("/user", userRouter);
router.use("/auth", authRouter);
export default router;
