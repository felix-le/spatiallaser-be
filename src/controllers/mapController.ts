import { Request, Response } from "express";

import { Pool } from "pg";
import config from "../config";
import { statusConstants } from "@constants/status.constants";
const { raiseException, responseServer } = require("../utils/response");
const pool = new Pool(config);

export const getMapData = async (req: Request, res: Response) => {
  try {
    // Fetch data from dfw_demo table
    const result = await pool.query(
      `SELECT income, population, ST_AsText(ST_centroid(spatialobj)) as centroid, ST_AsGeoJSON(spatialobj) as geometry FROM ${process.env.DB_TABLE_DEMO}`
    );

    // Send the data as JSON

    return responseServer(res, statusConstants.SUCCESS_CODE, result.rows);
    // res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    return raiseException(
      res,
      statusConstants.SERVER_ERROR_CODE,
      "Internal Server Error"
    );
  }
};

export const getAreaCentroidInside = async (req: Request, res: Response) => {
  const { lng, lat, radius } = req.query;

  try {
    // Fetch data from dfw_demo table
    const result = await pool.query(
      `SELECT * from (select *,ST_AsText(ST_centroid(spatialobj)) as centroid from ${process.env.DB_TABLE_DEMO}) as tmp where ST_Within(centroid, ST_Buffer(ST_GeomFromText('POINT(${lng} ${lat})'), ${radius}))`
    );

    // Send the data as JSON
    // res.json(result.rows);
    return responseServer(res, statusConstants.SUCCESS_CODE, result.rows);
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    return raiseException(
      res,
      statusConstants.SERVER_ERROR_CODE,
      "Internal Server Error"
    );
    // res.status(statusConstants.SERVER_ERROR_CODE).send("Internal Server Error");
  }
};

export const getAreaInsideCircle = async (req: Request, res: Response) => {
  const { lng, lat, radius } = req.query;

  try {
    // Fetch data from dfw_demo table
    const result = await pool.query(
      `SELECT * FROM dfw_demo 
      WHERE ST_Intersects(
        spatialobj, 
        ST_Buffer(ST_GeomFromText('POINT(${lng} ${lat})'), ${radius})::geography
      );`
    );

    // Send the data as JSON
    // res.json(result.rows);
    return responseServer(res, statusConstants.SUCCESS_CODE, result.rows);
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    // res.status(statusConstants.SERVER_ERROR_CODE).send("Internal Server Error");
    return raiseException(
      res,
      statusConstants.SERVER_ERROR_CODE,
      "Internal Server Error"
    );
  }
};
