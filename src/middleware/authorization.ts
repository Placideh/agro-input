import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User.entity";
import AppDataSource from "../data-source";
import { HTTP_ACCESS_DENIED } from "../constants/httpStatusCode";

export const authorization = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userRepo = AppDataSource.getRepository(User);
    //@ts-ignore
    const userId = req["currentUser"].id;
    const user = await userRepo.findOne({
      where: { id: userId },
    });
    console.log(user);
    if (!roles.includes(user?.role!)) {
      return res.status(HTTP_ACCESS_DENIED).json({ message: "Forbidden" });
    }
    next();
  };
};
