import { Router } from "https://deno.land/x/opine@2.3.4/mod.ts";

import zodValidate from "../../middlewares/zod_validation.ts";
import {} from "./test.schema.ts";

import tokenValidation from "../../middlewares/token_validation.ts";

import * as Handler from "./test.handler.ts";
const router = Router();

router.get("/api/test/v1/grpc-news", Handler.grpcTestNewsService);

export default router;
