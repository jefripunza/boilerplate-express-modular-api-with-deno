// @deno-types="npm:@types/express@4"
import { Router } from "npm:express@4.18.2";
import zodValidate from "../../middlewares/zod_validation.ts";
import {
  authLoginSchema,
  authRegisterSchema,
  authRequestResetPasswordSchema,
  authSubmitResetPasswordSchema,
} from "./auth.schema.ts";

import tokenValidation from "../../middlewares/token_validation.ts";
import { Role } from "../user-role/user-role.model.ts";

import * as Handler from "./auth.handler.ts";
const router = Router();

router.post(
  "/api/auth/v1/register",
  zodValidate({
    body: authRegisterSchema["body"],
  }),
  Handler.register
);

router.post(
  "/api/auth/v1/login",
  zodValidate({
    body: authLoginSchema["body"],
  }),
  Handler.login
);
router.delete(
  "/api/auth/v1/logout",
  tokenValidation(Role.All),
  Handler.logout
);

// Token...
router.get(
  "/api/auth/v1/token-validation",
  tokenValidation(Role.All),
  Handler.tokenValidation
);

// Password...
router.post(
  "/api/auth/v1/reset-password",
  tokenValidation(Role.All),
  zodValidate({
    body: authRequestResetPasswordSchema["body"],
  }),
  Handler.requestResetPassword
);
router.put(
  "/api/auth/v1/reset-password",
  tokenValidation(Role.All),
  zodValidate({
    body: authSubmitResetPasswordSchema["body"],
  }),
  Handler.submitResetPassword
);

export default router;
