import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";

import axios from "npm:axios@1.4.0";
import { getUrlDev } from "../src/utils/unit_test.ts";

import { fileExist } from "../src/helpers/fs.ts";
import {
  user_admin_testing,
  user_merchant_testing,
  user_customer_testing,
} from "../src/config.ts";

const token_admin = "tests/token-admin.txt";
const token_merchant = "tests/token-merchant.txt";
const token_customer = "tests/token-customer.txt";

const clearUserTesting = async () => {
  try {
    await axios.get(
      `${getUrlDev}/api/unit-testing/v1/clear-with-username/${user_admin_testing.username}`
    );
    if (await fileExist(token_admin)) await Deno.remove(token_admin);
    await axios.get(
      `${getUrlDev}/api/unit-testing/v1/clear-with-username/${user_merchant_testing.username}`
    );
    if (await fileExist(token_merchant)) await Deno.remove(token_merchant);
    await axios.get(
      `${getUrlDev}/api/unit-testing/v1/clear-with-username/${user_customer_testing.username}`
    );
    if (await fileExist(token_customer)) await Deno.remove(token_customer);
    return true;
  } catch (error) {
    console.log({ error });
    return false;
  }
};

Deno.test("clear user testing in collection on start testing", async () => {
  const isUserTestingClear = await clearUserTesting();
  assertEquals(isUserTestingClear, true);
});
