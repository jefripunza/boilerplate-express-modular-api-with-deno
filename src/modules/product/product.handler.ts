import {
  OpineRequest,
  OpineResponse,
} from "https://deno.land/x/opine@2.3.4/mod.ts";

import * as Schema from "./product.schema.ts";
import Service from "./product.service.ts";

export const categoryCreate = async (req: OpineRequest, res: OpineResponse) => {
  /**
    #swagger.tags = ['Product Category']
  */

  const { name, logo } = req.body;

  const response = await Service.categoryCreate(name, logo);

  return res.setStatus(response.statusCode).json(response);
};
