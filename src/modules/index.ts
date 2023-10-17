import { Router } from "https://deno.land/x/opine@2.3.4/mod.ts";

import { Server } from "../env.ts";

import UnitTesting from "./unit-testing/unit-testing.router.ts";
import Root from "./root/root.router.ts";
import Test from "./test/test.router.ts";

import Auth from "./auth/auth.router.ts";
import User from "./user/user.router.ts";

const router = Router();

router.use(Test);
if (Server.isDevelopment) {
  router.use(UnitTesting);
}

router.use(Root);
router.use(Auth);
router.use(User);

export default router;
