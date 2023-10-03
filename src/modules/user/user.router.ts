// @deno-types="npm:@types/express@4"
import { Router } from "npm:express@4.18.2";
import zodValidate from "../../middlewares/zod_validation.ts";
import {
  userUpdateSchema,
  userAddressCreateSchema,
  userAddressUpdateSchema,
} from "./user.schema.ts";

import tokenValidation from "../../middlewares/token_validation.ts";
import hasPermission from "../../middlewares/has_permission.ts";

import { Permissions } from "../permission/permission.model.ts";
import { Role } from "../user-role/user-role.model.ts";

import * as Handler from "./user.handler.ts";
const router = Router();

router.get(
  "/api/user/v1/init",
  tokenValidation(Role.All),
  hasPermission(Permissions.viewUser),
  Handler.init
);
router.put(
  "/api/user/v1/update",
  tokenValidation(Role.All),
  hasPermission(Permissions.updateUser),
  zodValidate({
    body: userUpdateSchema["body"],
  }),
  Handler.updateUser
);

// Address

router.post(
  "/api/user/v1/address",
  tokenValidation(Role.Merchant, Role.Customer),
  hasPermission(Permissions.createUserAddress),
  zodValidate({
    body: userAddressCreateSchema["body"],
  }),
  Handler.createUserAddress
);
router.get(
  "/api/user/v1/address",
  tokenValidation(Role.Merchant, Role.Customer),
  hasPermission(Permissions.viewUserAddress),
  Handler.listUserAddress
);
router.put(
  "/api/user/v1/address/:addressId",
  tokenValidation(Role.Merchant, Role.Customer),
  hasPermission(Permissions.viewUserAddress),
  zodValidate({
    params: userAddressUpdateSchema["params"],
    body: userAddressUpdateSchema["body"],
  }),
  Handler.updateUserAddress
);
router.patch(
  "/api/user/v1/address-set-default/:addressId",
  tokenValidation(Role.Merchant, Role.Customer),
  hasPermission(Permissions.viewUserAddress),
  zodValidate({
    params: userAddressUpdateSchema["params"],
  }),
  Handler.setDefaultUserAddress
);
router.delete(
  "/api/user/v1/address/:addressId",
  tokenValidation(Role.Merchant, Role.Customer),
  hasPermission(Permissions.viewUserAddress),
  zodValidate({
    params: userAddressUpdateSchema["params"],
  }),
  Handler.deleteUserAddress
);

export default router;
