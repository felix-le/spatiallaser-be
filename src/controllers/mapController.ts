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

    return responseServer(
      res,
      statusConstants.SUCCESS_CODE,
      "Connected Successfully",
      result.rows
    );
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

export const getCircle = async (req: Request, res: Response) => {
  const { lng, lat, radius } = req.query;

  try {
    const result = await pool.query(
      `SELECT ST_AsGeoJSON(ST_Buffer(ST_GeomFromText('POINT(${lng} ${lat})'), ${radius})) as circle`
    );

    return responseServer(
      res,
      statusConstants.SUCCESS_CODE,
      "Connected Successfully",
      result.rows
    );
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
    const result = await pool.query(
      `SELECT income, population, ST_AsGeoJSON(spatialobj) as geometry from (
        select *,ST_AsText(ST_centroid(spatialobj)) as centroid, 
        ST_Buffer(ST_GeomFromText('POINT(${lng} ${lat})'), ${radius}) as circle
        from ${process.env.DB_TABLE_DEMO}
      ) as tmp 
      where ST_Within(
        centroid, 
        circle
      )`
    );

    return responseServer(
      res,
      statusConstants.SUCCESS_CODE,
      "Connected Successfully",
      result.rows
    );
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    return raiseException(
      res,
      statusConstants.SERVER_ERROR_CODE,
      "Internal Server Error"
    );
  }
};

export const getAreaInsideCircle = async (req: Request, res: Response) => {
  const { lng, lat, radius } = req.query;

  try {
    // Fetch data from dfw_demo table
    const result = await pool.query(
      `SELECT AVG(income) as avg_income FROM dfw_demo
      WHERE ST_Intersects(
        spatialobj,
        ST_Buffer(ST_GeomFromText('POINT(${lng} ${lat})'), ${radius})::geography
      );`
    );

    return responseServer(
      res,
      statusConstants.SUCCESS_CODE,
      "Connected Successfully",
      result.rows
    );
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    return raiseException(
      res,
      statusConstants.SERVER_ERROR_CODE,
      "Internal Server Error"
    );
  }
};
