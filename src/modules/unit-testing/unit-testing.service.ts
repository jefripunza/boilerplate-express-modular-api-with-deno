import { Status } from "https://deno.land/x/opine@2.3.4/deps.ts";
import * as DTO from "../../dto.ts";

import UserModel from "../user/user.model.ts";
import UserAddressModel from "../user/user-address.model.ts";

import {
  user_admin_testing,
  user_merchant_testing,
  user_customer_testing,
} from "../../config.ts";

class UnitTestingService {
  async clearWithUsername(username: string) {
    if (
      !(
        user_admin_testing.username == username ||
        user_merchant_testing.username == username ||
        user_customer_testing.username == username
      )
    ) {
      return DTO.errorResponse({
        message: "it's not user testing...",
      });
    }

    try {
      const user = await UserModel.findOne({
        username,
      });

      // all clearance here...
      await UserAddressModel.deleteMany({
        user: user?.id,
      });
      await UserModel.deleteOne({
        username,
      });

      return DTO.successResponse({
        statusCode: Status.NoContent,
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
