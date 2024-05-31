import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const { DB_PORT, DB_URL, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_URL,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  entities: ["src/**/*.entity{.ts,.js}"],
  synchronize: true,
});

export default AppDataSource;
