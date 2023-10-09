// @deno-types="npm:@types/express@4"
import { Router } from "npm:express@4.18.2";
import zodValidate from "../../middlewares/zod_validation.ts";
import { unitTestingDeleteUserSchema } from "./unit-testing.schema.ts";

import * as Handler from "./unit-testing.handler.ts";
const router = Router();

router.get(
  "/api/unit-testing/v1/clear-with-username/:username",
  zodValidate(unitTestingDeleteUserSchema),
  Handler.clearWithUsername
);

export default router;
