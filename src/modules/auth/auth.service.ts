// deno-lint-ignore-file ban-ts-comment
// @deno-types="npm:@types/express@4"
import { Response } from "npm:express@4.18.2";
// @deno-types="npm:@types/uuid@9.0.0"
import { v4 as uuidv4 } from "npm:uuid@9.0.0";

import { StatusCodes } from "npm:http-status-codes@2.2.0";
import * as DTO from "../../dto.ts";

import RoleModel, { Role } from "../user-role/user-role.model.ts";
import UserModel, { User } from "../user/user.model.ts";
import RevokeTokenModel, { RevokeToken } from "./revoke-token.model.ts";

import * as jwt from "../../utils/jsonwebtoken.ts";
import * as encryption from "../../utils/encryption.ts";
import { user_testing } from "../../config.ts";

class AuthService {
  async register(
    username: string,
    password: string,
    name: string,
    profile_image: string | null
  ) {
    try {
      const isUserExist = await UserModel.findOne({ username });
      if (isUserExist) {
        return DTO.errorResponse({
          message: "user sudah terdaftar!",
        });
      }

      const role = await RoleModel.findOne({
        name: Role.Customer,
      });
      await UserModel.create({
        // @ts-ignore
        role: role.id,
        username,
        password: encryption.encode(password),
        name,
        profile_image,
      });

      return DTO.successResponse({
        statusCode: StatusCodes.CREATED,
      });
    } catch (error) {
      return DTO.internalServerErrorResponse("auth.register", error);
    }
  }

  async login(res: Response, username: string, password: string) {
    try {
      const isLogin = await UserModel.findOne({ username })
        .populate("role", {
          _id: 0,
          name: 1,
        })
        .then((doc: any) => {
          doc.role = doc.role.name;
          return doc;
        });
      if (!isLogin) {
        return DTO.errorResponse({
          message: "username atau password salah!",
        });
      }
      if (password != encryption.decode(isLogin.password)) {
        return DTO.errorResponse({
          message: "username atau password salah!",
        });
      }

      // create token
      const { token, jwtid } = jwt.createToken({
        id: isLogin.id,
        role: isLogin.role,
      });
      await RevokeTokenModel.create({
        user: isLogin.id,
        jwtid,
      });

      res.cookie("token", token, {
        httpOnly: true,
      });

      return DTO.successResponse({
        data: {
          token,
          userId: isLogin.id,
          role: isLogin.role,
          permissions: [],
        },
      });
    } catch (error) {
      return DTO.internalServerErrorResponse("auth.register", error);
    }
  }

  async logout(res: Response) {
    try {
      await RevokeTokenModel.deleteOne({
        jwtid: res.locals.user.jti,
      });
      res.clearCookie("token");

      return DTO.successResponse({
        statusCode: StatusCodes.NO_CONTENT,
      });
    } catch (error) {
      return DTO.internalServerErrorResponse("auth.logout", error);
    }
  }

  async tokenValidation(token: string) {
    try {
      const { error, message, data } = await jwt.verifyToken(token);
      if (error) {
        return DTO.errorResponse({
          message,
          data,
        });
      }

      return DTO.successResponse({
        data,
      });
    } catch (error) {
      return DTO.internalServerErrorResponse("auth.tokenValidation", error);
    }
  }

  async requestResetPassword(username: string) {
    try {
      const isUserExist = await UserModel.findOne({
        username,
      });
      if (!isUserExist) {
        return DTO.notFoundResponse("user tidak ditemukan!");
      }
      if (isUserExist?.forgot_password_ref) {
        console.log({ your_ref: isUserExist?.forgot_password_ref }); // send email...

        return DTO.notFoundResponse("user sudah pernah submit reset password!");
      }

      const generate_ref = uuidv4();
      await UserModel.updateOne(
        {
          username,
        },
        {
          $set: { forgot_password_ref: generate_ref },
        }
      );

      console.log({ username, your_ref: generate_ref }); // send email...

      const message = "sukses mengirimkan link reset password di email anda!";
      if (user_testing.username == username) {
        return DTO.successResponse({
          message,
          data: {
            ref: generate_ref,
          },
        });
      }

      return DTO.successResponse({
        message,
      });
    } catch (error) {
      return DTO.internalServerErrorResponse(
        "auth.requestResetPassword",
        error
      );
    }
  }

  async submitResetPassword(
    ref: string,
    password: string,
    newPassword: string,
    rePassword: string
  ) {
    try {
      const isRefExist = await UserModel.findOne({
        forgot_password_ref: ref,
      });
      if (!isRefExist) {
        return DTO.notFoundResponse("referensi tidak ditemukan!");
      }
      if (encryption.decode(isRefExist.password) != password) {
        return DTO.errorResponse({
          message: "password awal tidak sama!",
        });
      }
      if (newPassword != rePassword) {
        return DTO.errorResponse({
          message: "password dan ulang password tidak sama!",
        });
      }

      await UserModel.updateOne(
        {
          _id: isRefExist._id,
        },
        {
          $set: {
            password: encryption.encode(newPassword),
          },
          $unset: {
            forgot_password_ref: 1,
          },
        }
      );

      return DTO.successResponse({
        message: "password anda berhasil dirubah!",
      });
    } catch (error) {
      return DTO.internalServerErrorResponse("auth.submitResetPassword", error);
    }
  }
}

export default new AuthService();
