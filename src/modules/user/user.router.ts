import { Router } from "https://deno.land/x/opine@2.3.4/mod.ts";

import zodValidate from "../../middlewares/zod_validation.ts";
import {
  userUpdateSchema,
  userAddressCreateSchema,
  userAddressUpdateSchema,
} from "./user.schema.ts";

import tokenValidation from "../../middlewares/token_validation.ts";
import hasPermission from "../../middlewares/has_permission.ts";

import { Permissions } from "../permission/permission.model.ts";
import { Role } from "./user-role.model.ts";

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
  zodValidate(userUpdateSchema),
  Handler.updateUser
);

// Address

router.post(
  "/api/user/v1/address",
  tokenValidation(Role.Merchant, Role.Customer),
  hasPermission(Permissions.createUserAddress),
  zodValidate(userAddressCreateSchema),
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
  zodValidate(userAddressUpdateSchema),
  Handler.updateUserAddress
);
router.patch(
  "/api/user/v1/address-set-default/:addressId",
  tokenValidation(Role.Merchant, Role.Customer),
  hasPermission(Permissions.viewUserAddress),
  zodValidate(userAddressUpdateSchema),
  Handler.setDefaultUserAddress
);
router.delete(
  "/api/user/v1/address/:addressId",
  tokenValidation(Role.Merchant, Role.Customer),
  hasPermission(Permissions.viewUserAddress),
  zodValidate(userAddressUpdateSchema),
  Handler.deleteUserAddress
);

export default router;
