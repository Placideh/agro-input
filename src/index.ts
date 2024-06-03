import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import AppDataSource from "./data-source";
import bodyParser from "body-parser";
import router from "./router";
import { HTTP_NOT_FOUND } from "./constants/httpStatusCode";

dotenv.config();
const { SERVER_PORT, SERVER_HOST } = process.env;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", router, (_: Request, response: Response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.status(HTTP_NOT_FOUND).send({ message: "Route not found" });
});

//server - database connection
AppDataSource.initialize()
  .then(() => {
    app.listen(SERVER_PORT || "8080", () => {
      console.log(`Server is running at : ${SERVER_HOST}:${SERVER_PORT} `);
    });
    console.log("✅Database connected✅");
  })
  .catch((error) => {
    console.log("Server connection failed❌", error);
  });

export default app;
