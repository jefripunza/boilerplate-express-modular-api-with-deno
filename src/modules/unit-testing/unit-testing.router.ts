import { Router } from "https://deno.land/x/opine@2.3.4/mod.ts";

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
