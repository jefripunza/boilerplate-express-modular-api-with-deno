import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";
import { StatusCodes } from "npm:http-status-codes@2.2.0";

import axios from "npm:axios@1.4.0";
import { getUrlDev } from "../src/utils/unit_test.ts";

import { isString } from "../src/helpers/validation.ts";

import { Role } from "../src/modules/user-role/user-role.model.ts";

const token_admin = await Deno.readTextFile("tests/token-admin.txt");
const token_customer = await Deno.readTextFile("tests/token-customer.txt");

// ======================================================================== //
// -> User Update

Deno.test("User, Update (Negative) : wrong body", async () => {
  try {
    await axios
      .put(
        `${getUrlDev}/api/user/v1/update`,
        {
          name: "1",
          profile_image: 123,
        },
        {
          headers: { Authorization: `Bearer ${token_customer}` },
        }
      )
      .then((res) => res.data);
  } catch (error) {
    const { statusCode, message, success, data } = error.response.data;
    assertEquals(statusCode, StatusCodes.UNPROCESSABLE_ENTITY);
    assertEquals(message, "Validation error");
    assertEquals(success, false);
    assertEquals(data[0].message, "nama min 3 karakter!");
    assertEquals(data[1].message, "Expected string, received number");
  }
});

Deno.test("User, Update (Positive) : success update user", async () => {
  try {
    const result = await axios
      .put(
        `${getUrlDev}/api/user/v1/update`,
        {
          profile_image: "success.jpg",
        },
        {
          headers: { Authorization: `Bearer ${token_customer}` },
        }
      )
      .then((res) => res.data);
    assertEquals(result.statusCode, StatusCodes.OK);
    assertEquals(result.message, "OK");
    assertEquals(result.success, true);

    const { matchedCount, modifiedCount } = result.data;
    assertEquals(matchedCount, 1);
    assertEquals(modifiedCount, 1);
  } catch (error) {
    const { statusCode, message, success, data } = error.response.data;
    console.log({ statusCode, message, success, data });
    assertEquals(statusCode, StatusCodes.OK);
  }
});

// ======================================================================== //
// -> User Init

Deno.test("User, Init (Positive) : get data user", async () => {
  try {
    const result = await axios
      .get(`${getUrlDev}/api/user/v1/init`, {
        headers: { Authorization: `Bearer ${token_customer}` },
      })
      .then((res) => res.data);
    assertEquals(result.statusCode, StatusCodes.OK);
    assertEquals(result.message, "OK");
    assertEquals(result.success, true);

    const { role, username, name, createdAt, updatedAt, profile_image } =
      result.data;
    assertEquals(isString(role), true);
    assertEquals(role, Role.Customer);
    assertEquals(isString(username), true);
    assertEquals(isString(name), true);
    assertEquals(isString(createdAt), true);
    assertEquals(isString(updatedAt), true);
    assertEquals(profile_image, "success.jpg");
  } catch (error) {
    const { statusCode, message, success, data } = error.response.data;
    console.log({ statusCode, message, success, data });
    assertEquals(statusCode, StatusCodes.OK);
  }
});
