import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import logger from "morgan";
import routes from "@routes/index";
import cache from "./routeCache";
import { Pool } from "pg";
import config from "./config";

const pool = new Pool(config);

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("json spaces", 4);

// Test the database connection
pool.query("SELECT NOW()", (err: Error, res: any) => {
  // Specify the types here
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database at", process.env.DB_HOST);
  }
});

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5555;

app.use("/api/", cache(300), routes);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

export default app;
