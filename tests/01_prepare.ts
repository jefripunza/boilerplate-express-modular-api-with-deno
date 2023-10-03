import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";

import axios from "npm:axios@1.4.0";
import { getUrlDev } from "../src/utils/unit_test.ts";

import { user_testing } from "../src/config.ts";

const token_file_path = "tests/token.txt";

const clearUserTesting = async () => {
  await axios.get(
    `${getUrlDev}/api/unit-testing/v1/clear-with-username/${user_testing.username}`
  );
  await Deno.remove(token_file_path);
  return true;
};

Deno.test("clear user testing in collection on start testing", async () => {
  const isUserTestingClear = await clearUserTesting();
  assertEquals(isUserTestingClear, true);
});
