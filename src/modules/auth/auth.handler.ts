import {
  OpineRequest,
  OpineResponse,
} from "https://deno.land/x/opine@2.3.4/mod.ts";

import * as Schema from "./auth.schema.ts";
import Service from "./auth.service.ts";

export const register = async (req: OpineRequest, res: OpineResponse) => {
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

  return res.setStatus(response.statusCode).json(response);
};

export const login = async (req: OpineRequest, res: OpineResponse) => {
  /**
    #swagger.tags = ['Auth']
  */

  const { username, password } = req.body;

  const response = await Service.login(res, username, password);

  return res.setStatus(response.statusCode).json(response);
};

export const logout = async (_: OpineRequest, res: OpineResponse) => {
  /**
    #swagger.tags = ['Auth']
    #swagger.security = [{ "Bearer": [] }]
    #swagger.summary = '(*)'
  */

  const response = await Service.logout(res);

  return res.setStatus(response.statusCode).json(response);
};

export const tokenValidation = async (_: OpineRequest, res: OpineResponse) => {
  /**
    #swagger.tags = ['Auth']
    #swagger.security = [{ "Bearer": [] }]
    #swagger.summary = '(*)'
  */

  const { token } = res.locals;

  const response = await Service.tokenValidation(token);

  return res.setStatus(response.statusCode).json(response);
};

export const requestResetPassword = async (
  req: OpineRequest,
  res: OpineResponse
) => {
  /**
    #swagger.tags = ['Auth']
  */

  const { username } = req.body;

  const response = await Service.requestResetPassword(username);

  return res.setStatus(response.statusCode).json(response);
};

export const submitResetPassword = async (
  req: OpineRequest,
  res: OpineResponse
) => {
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

  return res.setStatus(response.statusCode).json(response);
};
