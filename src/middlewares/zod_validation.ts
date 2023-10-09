/* eslint-disable indent */
// @deno-types="npm:@types/express@4"
import { NextFunction, Request, Response } from "npm:express@4.18.2";
import { StatusCodes } from "npm:http-status-codes@2.2.0";
import { AnyZodObject, ZodError } from "npm:zod@3.22.1";

import * as DTO from "../dto.ts";

export default (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map((issue) => ({
          property: issue.path.join("."),
          message: issue.message,
          errorCode: issue.code,
        }));
        const response = DTO.errorResponse({
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
          message: "Validation error",
          data: validationErrors,
        });
        return res.status(response.statusCode).json(response);
      } else {
        next(error);
      }
    }
  };
