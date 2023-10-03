// @deno-types="npm:@types/express@4"
import { Request, Response } from "npm:express@4.18.2";

import Service from "./unit-testing.service.ts";

export const clearWithUsername = async (req: Request, res: Response) => {
  /**
    #swagger.tags = ['Unit Testing']
  */

  const { username } = req.params;

  const response = await Service.clearWithUsername(username);

  return res.status(response.statusCode).send(response);
};
