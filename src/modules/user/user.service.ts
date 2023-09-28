// deno-lint-ignore-file ban-ts-comment
// @deno-types="npm:@types/express@4"
import { Response } from "npm:express@4.18.2";
import { v4 as uuidv4 } from "npm:uuid@9.0.0";

import { StatusCodes } from "npm:http-status-codes@2.2.0";
import * as DTO from "../../dto.ts";

import UserModel, { User } from "../user/user.model.ts";

import * as jwt from "../../utils/jsonwebtoken.ts";
import * as encryption from "../../utils/encryption.ts";

class UserService {
  async init(id: string) {
    try {
      const user = await UserModel.findOne(
        {
          _id: id,
        },
        { _id: 0, password: 0, __v: 0 }
      )
        .populate("role")
        .then((doc: any) => {
          doc.role = doc?.role.name;
          return doc;
        });

      const data: any = user;
      return DTO.successResponse({
        data,
      });
    } catch (error) {
      return DTO.internalServerErrorResponse("user.init", error);
    }
  }

  async update(id: string, name: string, profile_image: string) {
    try {
      const updated: any = {};
      if (name) {
        updated["name"] = name;
      }
      if (profile_image) {
        updated["profile_image"] = profile_image;
      }

      const { matchedCount, modifiedCount } = await UserModel.updateOne(
        {
          _id: id,
        },
        updated
      );

      return DTO.successResponse({
        data: { matchedCount, modifiedCount },
      });
    } catch (error) {
      return DTO.internalServerErrorResponse("user.update", error);
    }
  }
}

export default new UserService();
