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

  return res.status(response.statusCode).json(response);
};

export const updateUser = async (req: Request, res: Response) => {
  /**
    #swagger.tags = ['User']
  */

  const { id }: ITokenContent = res.locals.user;
  const { name, profile_image } = req.body;

  const response = await Service.updateUser(id, name, profile_image);

  return res.status(response.statusCode).json(response);
};

export const createUserAddress = async (req: Request, res: Response) => {
  /**
    #swagger.tags = ['User Address']
  */

  const { id }: ITokenContent = res.locals.user;
  const { title, full, coordinate, postcode, rajaongkirCode } = req.body;

  const response = await Service.createUserAddress(
    id,

    title,
    full,
    coordinate,
    postcode,
    rajaongkirCode
  );

  return res.status(response.statusCode).json(response);
};

export const listUserAddress = async (req: Request, res: Response) => {
  /**
    #swagger.tags = ['User Address']
  */

  const { id }: ITokenContent = res.locals.user;

  const response = await Service.listUserAddress(id);

  return res.status(response.statusCode).json(response);
};

export const updateUserAddress = async (req: Request, res: Response) => {
  /**
    #swagger.tags = ['User Address']
  */

  const { id }: ITokenContent = res.locals.user;
  const { addressId } = req.params;
  const { title, full, coordinate, postcode, rajaongkirCode } = req.body;

  const response = await Service.updateUserAddress(
    id,
    addressId,

    title,
    full,
    coordinate,
    postcode,
    rajaongkirCode
  );

  return res.status(response.statusCode).json(response);
};

export const setDefaultUserAddress = async (req: Request, res: Response) => {
  /**
    #swagger.tags = ['User Address']
  */

  const { id }: ITokenContent = res.locals.user;
  const { addressId } = req.params;

  const response = await Service.setDefaultUserAddress(id, addressId);

  return res.status(response.statusCode).json(response);
};

export const deleteUserAddress = async (req: Request, res: Response) => {
  /**
    #swagger.tags = ['User Address']
  */

  const { id }: ITokenContent = res.locals.user;
  const { addressId } = req.params;

  const response = await Service.deleteUserAddress(id, addressId);

  return res.status(response.statusCode).json(response);
};
