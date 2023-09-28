// @deno-types="npm:@types/express@4"
import { Request, Response } from "npm:express@4.18.2";
import { IRequestJoin } from "../../contracts/request.contract.ts";

import * as Schema from "./user.schema.ts";
import Service from "./user.service.ts";

import { ITokenContent } from "../../contracts/request.contract.ts";

export const init = async (req: Request, res: Response) => {
  /**
    #swagger.tags = ['User']
  */

  const { id }: ITokenContent = res.locals.user;

  const response = await Service.init(id);

  return res.status(response.statusCode).send(response);
};

export const update = async (req: Request, res: Response) => {
  /**
    #swagger.tags = ['User']
  */

  const { id }: ITokenContent = res.locals.user;
  const { name, profile_image } = req.body;

  const response = await Service.update(id, name, profile_image);

  return res.status(response.statusCode).send(response);
};
