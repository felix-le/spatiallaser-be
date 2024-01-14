import dotenv from "dotenv";
import express, { Router } from "express";
dotenv.config();

import { getAreaCentroidInside, getAreaInsideCircle, getMapData } from "@controllers/mapController";

const router: Router = express.Router();

router.get("/map", getMapData);
router.get("/area-centroid-inside", getAreaCentroidInside);
router.get("/area-inside-circle", getAreaInsideCircle);

export default router;
