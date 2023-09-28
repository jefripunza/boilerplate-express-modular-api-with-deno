// @deno-types="npm:@types/express@4"
import { Request, Response } from "npm:express@4.18.2";
import { IRequestJoin } from "../../contracts/request.contract.ts";

import * as Schema from "./auth.schema.ts";
import Service from "./auth.service.ts";

export const register = async (req: Request, res: Response) => {
  /**
    #swagger.tags = ['Auth']
  */

  const { username, password, name, profile_image } = req.body;

  const response = await Service.register(
    username,
    password,
    name,
    profile_image
  );

  return res.status(response.statusCode).send(response);
};

export const login = async (req: Request, res: Response) => {
  /**
    #swagger.tags = ['Auth']
  */

  const { username, password } = req.body;

  const response = await Service.login(res, username, password);

  return res.status(response.statusCode).send(response);
};

export const logout = async (_: Request, res: Response) => {
  /**
    #swagger.tags = ['Auth']
    #swagger.security = [{ "Bearer": [] }]
    #swagger.summary = '(*)'
  */

  const response = await Service.logout(res);

  return res.status(response.statusCode).send(response);
};

export const tokenValidation = async (_: Request, res: Response) => {
  /**
    #swagger.tags = ['Auth']
    #swagger.security = [{ "Bearer": [] }]
    #swagger.summary = '(*)'
  */

  const { token } = res.locals;

  const response = await Service.tokenValidation(token);

  return res.status(response.statusCode).send(response);
};

export const requestResetPassword = async (req: Request, res: Response) => {
  /**
    #swagger.tags = ['Auth']
  */

  const { username } = req.body;

  const response = await Service.requestResetPassword(username);

  return res.status(response.statusCode).send(response);
};

export const submitResetPassword = async (req: Request, res: Response) => {
  /**
    #swagger.tags = ['Auth']
  */

  const { ref, password, newPassword, rePassword } = req.body;

  const response = await Service.submitResetPassword(
    ref,
    password,
    newPassword,
    rePassword
  );

  return res.status(response.statusCode).send(response);
};
