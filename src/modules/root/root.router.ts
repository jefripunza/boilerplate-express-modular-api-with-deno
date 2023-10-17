import { Router } from "https://deno.land/x/opine@2.3.4/mod.ts";

const router = Router();

router.get("/", (_, res) => {
  /**
    #swagger.tags = ['Root']
  */

  return res.send("halo dek...");
});

export default router;
