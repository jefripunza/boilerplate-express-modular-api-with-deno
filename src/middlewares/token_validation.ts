import {
  NextFunction,
  OpineRequest,
  OpineResponse,
} from "https://deno.land/x/opine@2.3.4/mod.ts";
import { Status } from "https://deno.land/x/opine@2.3.4/deps.ts";

import * as jwt from "../utils/jsonwebtoken.ts";
import * as DTO from "../dto.ts";

import RevokeTokenModel, {
  RevokeToken,
} from "../modules/auth/revoke-token.model.ts";

import { Role } from "../modules/user/user-role.model.ts";
import UserModel from "../modules/user/user.model.ts";

export default (...roles: Role[]) =>
  async (req: OpineRequest, res: OpineResponse, next: NextFunction) => {
    const cookie = req.get("cookie");
    let token = req.headers.get("authorization");
    if (!token) {
      return res.setStatus(Status.Forbidden).json(
        DTO.errorResponse({
          message: "Authorization is required!",
          statusCode: Status.Forbidden,
        })
      );
    }
    token = String(token).replace("Bearer ", "");

    try {
      const { error, message, data } = await jwt.verifyToken(token);
      if (error) {
        return res.setStatus(error).json(
          DTO.errorResponse({
            message,
            statusCode: error,
          })
        );
      }
      if (!data) {
        return res.setStatus(Status.Forbidden).json(
          DTO.errorResponse({
            message: "Data on JWT not found!",
            statusCode: Status.Forbidden,
          })
        );
      }

      // check session
      const isValidSession = await RevokeTokenModel.findOne({
        user: data.id,
        jwtid: data.jti,
      });
      if (!isValidSession) {
        res.clearCookie("token");
        return res.setStatus(Status.BadRequest).json(
          DTO.errorResponse({
            message: "invalid session!",
            statusCode: Status.BadRequest,
          })
        );
      }

      // check permit
      if (!roles.includes(Role.All)) {
        const isUserPermit = await UserModel.findOne(
          { _id: data.id },
          { role: 1 }
        )
          .populate("role")
          .then((doc: any) => {
            doc.role = doc.role.name;
            return doc;
          });
        if (!roles.includes(isUserPermit.role)) {
          return res.setStatus(Status.BadRequest).json(
            DTO.errorResponse({
              message: "user not permit!",
              statusCode: Status.BadRequest,
            })
          );
        }
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
      return res
        .setStatus(Status.InternalServerError)
        .json(
          DTO.internalServerErrorResponse("middlewares.token-validation", error)
        );
    }
  };
