import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import logger from "morgan";
import { Pool } from "pg";
import routes from "@routes/index";
import cache from "./routeCache";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("json spaces", 4);

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

// Test the database connection
pool.query("SELECT NOW()", (err: Error, res: any) => {
  // Specify the types here
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database at", process.env.DB_HOST);
  }
});

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.get("/", async (req: Request, res: Response) => {
  try {
    // Fetch data from dfw_demo table
    const result = await pool.query(
      `SELECT * FROM ${process.env.DB_TABLE_NAME}`
    );

    // Send the data as JSON
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.use("/api/", cache(300), routes);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

export default app;
