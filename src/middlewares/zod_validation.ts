import {
  NextFunction,
  OpineRequest,
  OpineResponse,
} from "https://deno.land/x/opine@2.3.4/mod.ts";
import { Status } from "https://deno.land/x/opine@2.3.4/deps.ts";

import { AnyZodObject, ZodError } from "npm:zod@3.22.1";

import * as DTO from "../dto.ts";

export default (schema: AnyZodObject) =>
  async (req: OpineRequest, res: OpineResponse, next: NextFunction) => {
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
          statusCode: Status.UnprocessableEntity,
          message: "Validation error",
          data: validationErrors,
        });
        return res.setStatus(response.statusCode).json(response);
      } else {
        next(error);
      }
    }
  };
