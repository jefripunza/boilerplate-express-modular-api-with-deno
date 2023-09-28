// @deno-types="npm:@types/express@4"
import { Router } from "npm:express@4.18.2";
import zodValidate from "../../middlewares/zod_validation.ts";
import { userUpdateSchema } from "./user.schema.ts";

import tokenValidation from "../../middlewares/token_validation.ts";
import { Role } from "../user-role/user-role.model.ts";

import * as Handler from "./user.handler.ts";
const router = Router();

router.get("/api/user/v1/init", tokenValidation(Role.All), Handler.init);
router.put(
  "/api/user/v1/update",
  tokenValidation(Role.All),
  zodValidate({
    body: userUpdateSchema["body"],
  }),
  Handler.update
);

export default router;
