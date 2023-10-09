// @deno-types="npm:@types/express@4"
import { Router } from "npm:express@4.18.2";
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
