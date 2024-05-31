import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { UserResponce } from "../../dto/user.dto";

dotenv.config();
const { JWT_SECRET, JWT_EXPIRATION } = process.env;
export class encrypt {
  static async encryptpassword(password: string) {
    return bcrypt.hashSync(password, 12);
  }
  static comparepassword(hashPassword: string, password: string) {
    return bcrypt.compareSync(password, hashPassword);
  }

  static generateToken(payload: UserResponce) {
    return jwt.sign(payload, JWT_SECRET!, { expiresIn: JWT_EXPIRATION });
  }
}
