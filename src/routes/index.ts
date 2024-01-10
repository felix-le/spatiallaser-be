import dotenv from "dotenv";
dotenv.config();
import express, { Router } from "express";
import { statusConstants } from "@constants/status.constants";

const router: Router = express.Router();

router.get("/", function (req, res, next) {
  res.status(statusConstants.SUCCESS_CODE).json("Welcome to the first - API");
});

export default router;
