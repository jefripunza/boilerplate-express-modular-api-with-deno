import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";
import {
  beforeAll,
  afterAll,
} from "https://deno.land/std@0.204.0/testing/bdd.ts";
import { superdeno } from "https://deno.land/x/superdeno/mod.ts";
import { app } from "../src/apps/opine.ts";
import { Status } from "https://deno.land/x/opine@2.3.4/deps.ts";

import { isString } from "../src/helpers/validation.ts";

import { Role } from "../src/modules/user/user-role.model.ts";

import { Mongo } from "../src/env.ts";
import { connectDatabase, disconnectDatabase } from "../src/apps/mongoose.ts";

const token_admin = await Deno.readTextFile("tests/token-admin.txt");
const token_merchant = await Deno.readTextFile("tests/token-merchant.txt");
const token_customer = await Deno.readTextFile("tests/token-customer.txt");

// ======================================================================== //
// -> User Update

Deno.test("User, Update (Negative) : wrong body", async () => {
  await connectDatabase(Mongo.url);

  await superdeno(app)
    .put(`/api/user/v1/update`)
    .send({
      name: "1",
      profile_image: 123,
    })
    .set("Authorization", `Bearer ${token_customer}`)
    .expect(Status.UnprocessableEntity)
    .then(({ body }) => {
      const { statusCode, message, success, data } = body;
      // assertEquals(statusCode, Status.UnprocessableEntity);
      assertEquals(message, "Validation error");
      assertEquals(success, false);
      assertEquals(data[0].message, "nama min 3 karakter!");
      assertEquals(data[1].message, "Expected string, received number");
    })
    .finally(async () => await disconnectDatabase());
});

Deno.test("User, Update (Positive) : success update user", async () => {
  await connectDatabase(Mongo.url);

  await superdeno(app)
    .put(`/api/user/v1/update`)
    .send({
      profile_image: "success.jpg",
    })
    .set("Authorization", `Bearer ${token_customer}`)
    .expect(Status.OK)
    .then(({ body }) => {
      const { message, success, data } = body;
      assertEquals(message, "OK");
      assertEquals(success, true);

      const { matchedCount, modifiedCount } = data;
      assertEquals(matchedCount, 1);
      assertEquals(modifiedCount, 1);
    })
    .finally(async () => await disconnectDatabase());
});

// ======================================================================== //
// -> User Init

Deno.test("User, Init (Positive) : get data user", async () => {
  await connectDatabase(Mongo.url);

  await superdeno(app)
    .get(`/api/user/v1/init`)
    .set("Authorization", `Bearer ${token_customer}`)
    .expect(Status.OK)
    .then(({ body }) => {
      const { message, success, data } = body;
      assertEquals(message, "OK");
      assertEquals(success, true);

      const { role, username, name, createdAt, updatedAt, profile_image } =
        data;
      assertEquals(isString(role), true);
      assertEquals(role, Role.Customer);
      assertEquals(isString(username), true);
      assertEquals(isString(name), true);
      assertEquals(isString(createdAt), true);
      assertEquals(isString(updatedAt), true);
      assertEquals(profile_image, "success.jpg");
    })
    .finally(async () => await disconnectDatabase());
});
