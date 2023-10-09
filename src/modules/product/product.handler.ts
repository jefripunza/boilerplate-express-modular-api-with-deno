// @deno-types="npm:@types/express@4"
import { Request, Response } from "npm:express@4.18.2";
import { IRequestJoin } from "../../contracts/request.contract.ts";

import * as Schema from "./product.schema.ts";
import Service from "./product.service.ts";

export const categoryCreate = async (req: Request, res: Response) => {
  /**
    #swagger.tags = ['Product Category']
  */

  const { name, logo } = req.body;

  const response = await Service.categoryCreate(name, logo);

  return res.status(response.statusCode).json(response);
};
