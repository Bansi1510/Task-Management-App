import { Response } from "express";

interface ResponsePayload {
  success: boolean;
  message?: string;
  data?: unknown;
}

export const resHandler = (
  res: Response,
  statusCode: number,
  payload: ResponsePayload
) => {
  return res.status(statusCode).json(payload);
};