// @deno-types="npm:@types/express@4"
import { NextFunction, Request, Response } from "npm:express@4.18.2";
import { StatusCodes } from "npm:http-status-codes@2.2.0";
import { IRequestJoin } from "../contracts/request.contract.ts";

import * as jwt from "../utils/jsonwebtoken.ts";

import RevokeTokenModel, {
  RevokeToken,
} from "../modules/auth/revoke-token.model.ts";

import { Role } from "../modules/user-role/user-role.model.ts";

export default (role: Role) =>
  async (req: any, res: Response, next: NextFunction) => {
    let token = req.headers.authorization || req.cookies.token;

    if (!token) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Authorization is required!",
      });
    }
    token = String(token).replace("Bearer ", "");

    try {
      const { error, message, data } = await jwt.verifyToken(token);
      if (error) {
        return res.status(error).json({
          message,
        });
      }
      if (!data) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: "Data on JWT not found!",
        });
      }

      const isValidSession = await RevokeTokenModel.findOne({
        user: data.id,
        jwtid: data.jti,
      });
      if (!isValidSession) {
        res.clearCookie("token");
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "invalid session!",
        });
      }

      // check expired
      const now = new Date();
      const exp = data.exp * 1000; // ms
      const exp_warning = new Date(exp);
      exp_warning.setDate(exp_warning.getDate() - 2); // - 2 hari sebelum token tewas
      if (now.getTime() >= exp_warning.getTime()) {
        await RevokeTokenModel.deleteOne({
          jwtid: data.jti,
        });
        let { token: newToken, jwtid: newJwtId } = jwt.createToken({
          id: data.id,
          role: data.role,
        });
        await RevokeTokenModel.create({
          user: data.id,
          jwtid: newJwtId,
        });
        // new token on header
        res.set("x-new-token", newToken);
        res.cookie("token", newToken, {
          httpOnly: true,
        });
        token = newToken;
      }

      res.locals.token = token;
      res.locals.user = data;
      return next();
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "internal server error",
      });
    }
  };
