import { Router } from "https://deno.land/x/opine@2.3.4/mod.ts";

import zodValidate from "../../middlewares/zod_validation.ts";
import {
  authLoginSchema,
  authRegisterSchema,
  authRequestResetPasswordSchema,
  authSubmitResetPasswordSchema,
} from "./auth.schema.ts";

import tokenValidation from "../../middlewares/token_validation.ts";
import { Role } from "../user/user-role.model.ts";

import * as Handler from "./auth.handler.ts";
const router = Router();

router.post(
  "/api/auth/v1/register",
  zodValidate(authRegisterSchema),
  Handler.register
);

router.post("/api/auth/v1/login", zodValidate(authLoginSchema), Handler.login);
router.delete("/api/auth/v1/logout", tokenValidation(Role.All), Handler.logout);

// Token Validation...
router.get(
  "/api/auth/v1/token-validation",
  tokenValidation(Role.All),
  Handler.tokenValidation
);

// Reset Password...
router.post(
  "/api/auth/v1/reset-password",
  tokenValidation(Role.All),
  zodValidate(authRequestResetPasswordSchema),
  Handler.requestResetPassword
);
router.put(
  "/api/auth/v1/reset-password",
  tokenValidation(Role.All),
  zodValidate(authSubmitResetPasswordSchema),
  Handler.submitResetPassword
);

export default router;
