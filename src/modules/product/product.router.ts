import { Router } from "https://deno.land/x/opine@2.3.4/mod.ts";

import zodValidate from "../../middlewares/zod_validation.ts";
import {
  productCategoryCreateSchema,
  productCategoryUpdateSchema,
  productCreateSchema,
} from "./product.schema.ts";

import tokenValidation from "../../middlewares/token_validation.ts";
import { Role } from "../user/user-role.model.ts";

import * as Handler from "./product.handler.ts";
const router = Router();

router.post(
  "/api/product/v1/category",
  zodValidate(productCategoryCreateSchema),
  Handler.categoryCreate
);

export default router;
