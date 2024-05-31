import { Request, Response } from "express";
import { User } from "../entity/User.entity";
import { encrypt } from "../helpers/shared/encrypt.helper";
import AppDataSource from "../data-source";

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(500)
          .json({ message: " email and password required" });
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });

      const isPasswordValid = encrypt.comparepassword(
        user?.password!,
        password
      );
      if (!user || !isPasswordValid) {
        return res.status(404).json({ message: "User not found" });
      }
      const token = encrypt.generateToken({ id: user.id });

      return res.status(200).json({ message: "Login successful", user, token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
