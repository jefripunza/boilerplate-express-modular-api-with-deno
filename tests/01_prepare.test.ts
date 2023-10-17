import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";
import { superdeno } from "https://deno.land/x/superdeno/mod.ts";
import { app } from "../src/apps/opine.ts";

import { fileExist } from "../src/helpers/fs.ts";
import {
  user_admin_testing,
  user_merchant_testing,
  user_customer_testing,
} from "../src/config.ts";

import { Mongo } from "../src/env.ts";
import { connectDatabase, disconnectDatabase } from "../src/apps/mongoose.ts";

const token_admin = "tests/token-admin.txt";
const token_merchant = "tests/token-merchant.txt";
const token_customer = "tests/token-customer.txt";

const clearUserTesting = async () => {
  await connectDatabase(Mongo.url);
  try {
    await superdeno(app).get(
      `/api/unit-testing/v1/clear-with-username/${user_admin_testing.username}`
    );
    if (await fileExist(token_admin)) await Deno.remove(token_admin);
    await superdeno(app).get(
      `/api/unit-testing/v1/clear-with-username/${user_merchant_testing.username}`
    );
    if (await fileExist(token_merchant)) await Deno.remove(token_merchant);
    await superdeno(app).get(
      `/api/unit-testing/v1/clear-with-username/${user_customer_testing.username}`
    );
    if (await fileExist(token_customer)) await Deno.remove(token_customer);
    return true;
  } catch (error) {
    console.log({ error });
    return false;
  } finally {
    await disconnectDatabase();
  }
};

await Deno.test(
  "clear user testing in collection on start testing",
  async () => {
    const isUserTestingClear = await clearUserTesting();
    assertEquals(isUserTestingClear, true);
  }
);
