// @deno-types="npm:@types/express@4"
import { NextFunction, Request, Response } from "npm:express@4.18.2";
import { StatusCodes } from "npm:http-status-codes@2.2.0";

import * as DTO from "../dto.ts";

import UserModel from "../modules/user/user.model.ts";
import PermissionModel from "../modules/permission/permission.model.ts";
import UserPermissionModel from "../modules/user-permission/user-permission.model.ts";

export default (permissionName: string) =>
  async (req: any, res: Response, next: NextFunction) => {
    const { id } = res.locals.user;

    const user = await UserModel.findOne(
      {
        _id: id,
      },
      { role: 1 }
    );
    const permission = await PermissionModel.findOne(
      {
        key: permissionName,
      },
      { _id: 1 }
    );
    const user_permission = await UserPermissionModel.findOne({
      role: user?.role,
      permission: permission?._id,
    });

    const message = "user not permission on this feature";
    const code = StatusCodes.UNAUTHORIZED;
    if (!user_permission) {
      return res.status(code).json(
        DTO.errorResponse({
          message,
          statusCode: code,
        })
      );
    } else {
      if (!user_permission.canAccess) {
        return res.status(code).json(
          DTO.errorResponse({
            message,
            statusCode: code,
          })
        );
      }
    }

    return next();
  };
