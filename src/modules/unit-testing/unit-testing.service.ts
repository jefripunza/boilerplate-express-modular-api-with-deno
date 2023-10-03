import { StatusCodes } from "npm:http-status-codes@2.2.0";
import * as DTO from "../../dto.ts";

import UserModel from "../user/user.model.ts";

import { user_testing } from "../../config.ts";

class UnitTestingService {
  async clearWithUsername(username: string) {
    if (user_testing.username != username) {
      return DTO.errorResponse({
        message: "it's not user testing...",
      });
    }

    try {
      // all clearance here...

      await UserModel.deleteOne({
        username,
      });

      return DTO.successResponse({
        statusCode: StatusCodes.NO_CONTENT,
        message: "success clear with username!",
      });
    } catch (error) {
      return DTO.internalServerErrorResponse(
        "unit-testing.clearWithUsername",
        error
      );
    }
  }
}

export default new UnitTestingService();
