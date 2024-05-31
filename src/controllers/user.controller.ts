import { Request, Response } from "express";
import AppDataSource from "../data-source";
import { User } from "../entity/User.entity";
import {
  HTTP_CREATED,
  HTTP_NOT_FOUND,
  HTTP_OK,
} from "../constants/httpStatusCode";
import { encrypt } from "../helpers/shared/encrypt.helper";
import { UserResponce } from "../dto/user.dto";

export class UserController {
  static async registerUser(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const encryptedPassword = await encrypt.encryptpassword(password);
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = encryptedPassword;

    const userRepo = AppDataSource.getRepository(User);
    await userRepo.save(user);
    const createdUser = new UserResponce();
    createdUser.name = user.name;
    createdUser.email = user.email;
    createdUser.role = user.role;

    return res.status(HTTP_CREATED).json({
      message: "User registered successfully",
      data: createdUser,
    });
  }

  static async getUser(req: Request, res: Response) {
    const { id } = req.params;
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id } });
    if (user === null) {
      return res
        .status(HTTP_NOT_FOUND)
        .json({ message: `User with ${id} is not found` });
    }
    const existingUser = new UserResponce();
    existingUser.name = user.name;
    existingUser.email = user.email;
    existingUser.role = user.role;
    return res.status(HTTP_OK).json({
      message: "Fertilizer retrieved successfully",
      data: existingUser,
    });
  }
}
