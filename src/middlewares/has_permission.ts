import {
  NextFunction,
  OpineRequest,
  OpineResponse,
} from "https://deno.land/x/opine@2.3.4/mod.ts";
import { Status } from "https://deno.land/x/opine@2.3.4/deps.ts";

import * as DTO from "../dto.ts";

import UserModel from "../modules/user/user.model.ts";
import PermissionModel from "../modules/permission/permission.model.ts";
import UserPermissionModel from "../modules/user/user-permission.model.ts";

export default (permissionName: string) =>
  async (_req: OpineRequest, res: OpineResponse, next: NextFunction) => {
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
    const code = Status.Unauthorized;
    if (!user_permission) {
      return res.setStatus(code).json(
        DTO.errorResponse({
          message,
          statusCode: code,
        })
      );
    } else {
      if (!user_permission.canAccess) {
        return res.setStatus(code).json(
          DTO.errorResponse({
            message,
            statusCode: code,
          })
        );
      }
    }

    return next();
  };
