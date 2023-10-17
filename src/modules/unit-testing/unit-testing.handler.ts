import {
  OpineRequest,
  OpineResponse,
} from "https://deno.land/x/opine@2.3.4/mod.ts";

import Service from "./unit-testing.service.ts";

export const clearWithUsername = async (
  req: OpineRequest,
  res: OpineResponse
) => {
  /**
    #swagger.tags = ['Unit Testing']
    #swagger.deprecated = true
  */

  const { username } = req.params;

  const response = await Service.clearWithUsername(username);

  return res.setStatus(response.statusCode).json(response);
};
