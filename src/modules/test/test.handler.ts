import {
  OpineRequest,
  OpineResponse,
} from "https://deno.land/x/opine@2.3.4/mod.ts";

import Service from "./test.service.ts";

export const grpcTestNewsService = async (
  _req: OpineRequest,
  res: OpineResponse
) => {
  /**
    #swagger.tags = ['Test']
  */

  const response = await Service.grpcTestNewsService();

  return res.setStatus(response.statusCode).json(response);
};
