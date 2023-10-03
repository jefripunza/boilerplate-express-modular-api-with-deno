// @deno-types="npm:@types/express@4"
import { Router } from "npm:express@4.18.2";

import { Server } from "../env.ts";

import UnitTesting from "./unit-testing/unit-testing.router.ts";
import Root from "./root/root.router.ts";

import Auth from "./auth/auth.router.ts";
import User from "./user/user.router.ts";

const router = Router();

if (Server.isDevelopment) {
  router.use(UnitTesting);
}

router.use(Root);
router.use(Auth);
router.use(User);

export default router;
