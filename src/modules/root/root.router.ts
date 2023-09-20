// @deno-types="npm:@types/express@4"
import { Router } from "npm:express@4.18.2";

const router = Router();

router.get("/", (_, res) => {
  return res.send("halo dek...");
});

export default router;
