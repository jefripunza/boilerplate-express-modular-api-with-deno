/* eslint-disable indent */
// @deno-types="npm:@types/express@4"
import { NextFunction, Request, Response } from "npm:express@4.18.2";
import { StatusCodes } from "npm:http-status-codes@2.2.0";
import { AnyZodObject, ZodError } from "npm:zod@3.22.1";

import * as DTO from "../dto.ts";

interface IScheme {
  params?: AnyZodObject;
  body?: AnyZodObject;
  query?: AnyZodObject;
}

export default (...schema: IScheme[]) =>
async (req: Request, res: Response, next: NextFunction) => {
  try {
    for (let i = 0; i < schema.length; i++) {
      const zod = schema[i];
      if (zod.body) {
        await zod.body.parseAsync(req.body);
      }
      if (zod.params) {
        await zod.params.parseAsync(req.params);
      }
      if (zod.query) {
        await zod.query.parseAsync(req.query);
      }
    }
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const data = error.issues.map((issue) => ({
        property: issue.path.join("."),
        message: issue.message,
        errorCode: issue.code,
      }));
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(
        DTO.errorResponse({
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
          message: "Validation error",
          data,
        }),
      );
    } else {
      next(error);
    }
  }
};
