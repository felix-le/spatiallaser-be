import { Response } from "express"; // Assuming you're using Express for the response object

interface ResponseData {
  statusCode: number;
  message: string;
  count?: number;
  data?: any[];
}

function responseServer(
  response: Response,
  statusCode: number,
  message: string,
  data?: any[]
): Response {
  const responseData: ResponseData = {
    statusCode: statusCode,
    message,
  };

  if (data) {
    responseData.count = data.length;
    responseData.data = data;
  }

  return response.status(statusCode).json(responseData);
}

interface ExceptionBody {
  statusCode: number;
  message: string;
  error?: any;
}

function raiseException(
  response: Response,
  statusCode: number,
  message: string,
  error?: any
): Response {
  const exceptionBody: ExceptionBody = {
    statusCode: statusCode,
    message,
  };

  if (error) {
    exceptionBody.error = error;
  }

  return response.status(statusCode).json(exceptionBody);
}

export { responseServer, raiseException };
