import dotenv from "dotenv";
import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import logger from "morgan";
import routes from "@routes/index";
import cache from "./routeCache";

const app: Application = express();

dotenv.config();
app.use(cors());
app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("json spaces", 4);

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/", cache(300), routes); // use routes

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

export default app;
