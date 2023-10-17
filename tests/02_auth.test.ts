import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";
import {
  beforeAll,
  afterAll,
} from "https://deno.land/std@0.204.0/testing/bdd.ts";
import { superdeno } from "https://deno.land/x/superdeno/mod.ts";
import { app } from "../src/apps/opine.ts";
import { Status } from "https://deno.land/x/opine@2.3.4/deps.ts";

import {
  user_admin_testing,
  user_merchant_testing,
  user_customer_testing,
} from "../src/config.ts";
import {
  isArrayOfString,
  isString,
  isNumber,
} from "../src/helpers/validation.ts";

import { Mongo } from "../src/env.ts";
import { connectDatabase, disconnectDatabase } from "../src/apps/mongoose.ts";

const token_admin = "tests/token-admin.txt";
const token_merchant = "tests/token-merchant.txt";
const token_customer = "tests/token-customer.txt";

// ================================================================================================================ //
// -> Register New User

await Deno.test(
  "Auth, Register New User (Negative) : wrong body format",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .post(`/api/auth/v1/register`)
      .send({
        username: 1234567890,
        password: "uyee",

        name: "hm",
        profile_image: "",
      })
      .expect(Status.UnprocessableEntity)
      .then(({ body }) => {
        const { message, success, data } = body;
        assertEquals(success, false);
        assertEquals(message, "Validation error");
        assertEquals(data[0].message, "Expected string, received number");
        assertEquals(data[1].message, "Password harus minimal 8 karakter!");
        assertEquals(data[2].message, "nama min 3 karakter!");
        assertEquals(
          data[3].message,
          "Password harus memiliki setidaknya 1 huruf besar!"
        );
        assertEquals(
          data[4].message,
          "Password harus memiliki setidaknya 1 angka!"
        );
        assertEquals(
          data[5].message,
          "Password harus memiliki setidaknya 1 simbol!"
        );
      })
      .finally(async () => await disconnectDatabase());
  }
);

await Deno.test(
  "Auth, Register New User (Positive) : user admin created",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .post(`/api/auth/v1/register`)
      .send(user_admin_testing)
      .expect(Status.Created)
      .then(({ body }) => {
        const { message, success, data } = body;
        assertEquals(message, "OK");
        assertEquals(success, true);
        assertEquals(data, []);
      })
      .finally(async () => await disconnectDatabase());
  }
);

await Deno.test(
  "Auth, Register New User (Positive) : user merchant created",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .post(`/api/auth/v1/register`)
      .send(user_merchant_testing)
      .expect(Status.Created)
      .then(({ body }) => {
        const { message, success, data } = body;
        assertEquals(message, "OK");
        assertEquals(success, true);
        assertEquals(data, []);
      })
      .finally(async () => await disconnectDatabase());
  }
);

await Deno.test(
  "Auth, Register New User (Positive) : user customer created",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .post(`/api/auth/v1/register`)
      .send(user_customer_testing)
      .expect(Status.Created)
      .then(({ body }) => {
        const { message, success, data } = body;
        assertEquals(message, "OK");
        assertEquals(success, true);
        assertEquals(data, []);
      })
      .finally(async () => await disconnectDatabase());
  }
);

await Deno.test(
  "Auth, Register New User (Negative) : user is already register",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .post(`/api/auth/v1/register`)
      .send(user_customer_testing)
      .expect(Status.BadRequest)
      .then(({ body }) => {
        const { message, success } = body;
        assertEquals(message, "user sudah terdaftar!");
        assertEquals(success, false);
      })
      .finally(async () => await disconnectDatabase());
  }
);

// // ================================================================================================================ //
// // -> Login User

await Deno.test("Auth, Login User (Negative) : wrong body", async () => {
  await connectDatabase(Mongo.url);

  await superdeno(app)
    .post(`/api/auth/v1/login`)
    .send({
      username: "anu",
      password: "test",
    })
    .expect(Status.UnprocessableEntity)
    .then(({ body }) => {
      const { message, success, data } = body;
      assertEquals(message, "Validation error");
      assertEquals(success, false);
      assertEquals(data[0].message, "username min 6 karakter!");
    })
    .finally(async () => await disconnectDatabase());
});

await Deno.test("Auth, Login User (Negative) : wrong username", async () => {
  await connectDatabase(Mongo.url);

  await superdeno(app)
    .post(`/api/auth/v1/login`)
    .send({
      username: "user_customer_testing.username",
      password: user_customer_testing.password,
    })
    .expect(Status.UnprocessableEntity)
    .then(({ body }) => {
      const { message, success, data } = body;
      assertEquals(message, "Validation error");
      assertEquals(success, false);
      assertEquals(data[0].message, "username max 25 karakter!");
    })
    .finally(async () => await disconnectDatabase());
});

await Deno.test("Auth, Login User (Negative) : wrong password", async () => {
  await connectDatabase(Mongo.url);

  await superdeno(app)
    .post(`/api/auth/v1/login`)
    .send({
      username: user_customer_testing.username,
      password: "test",
    })
    .expect(Status.UnprocessableEntity)
    .then(({ body }) => {
      const { message, success, data } = body;
      assertEquals(message, "Validation error");
      assertEquals(success, false);
      assertEquals(data[0].message, "Password harus minimal 8 karakter!");
      assertEquals(
        data[1].message,
        "Password harus memiliki setidaknya 1 huruf besar!"
      );
      assertEquals(
        data[2].message,
        "Password harus memiliki setidaknya 1 angka!"
      );
      assertEquals(
        data[3].message,
        "Password harus memiliki setidaknya 1 simbol!"
      );
    })
    .finally(async () => await disconnectDatabase());
});

await Deno.test("Auth, Login User (Positive) : admin logged", async () => {
  await connectDatabase(Mongo.url);

  await superdeno(app)
    .post(`/api/auth/v1/login`)
    .send({
      username: user_admin_testing.username,
      password: user_admin_testing.password,
    })
    .expect(Status.OK)
    .then(async ({ body }) => {
      const { message, success, data } = body;
      assertEquals(message, "OK");
      assertEquals(success, true);

      const { permissions, role, token: newToken, userId } = data;
      assertEquals(isArrayOfString(permissions), true);
      assertEquals(isString(role), true);
      assertEquals(isString(newToken), true);
      assertEquals(isString(userId), true);

      await Deno.writeTextFile(token_admin, newToken);
    })
    .finally(async () => await disconnectDatabase());
});

await Deno.test("Auth, Login User (Positive) : merchant logged", async () => {
  await connectDatabase(Mongo.url);

  await superdeno(app)
    .post(`/api/auth/v1/login`)
    .send({
      username: user_merchant_testing.username,
      password: user_merchant_testing.password,
    })
    .expect(Status.OK)
    .then(async ({ body }) => {
      const { message, success, data } = body;
      assertEquals(message, "OK");
      assertEquals(success, true);

      const { permissions, role, token: newToken, userId } = data;
      assertEquals(isArrayOfString(permissions), true);
      assertEquals(isString(role), true);
      assertEquals(isString(newToken), true);
      assertEquals(isString(userId), true);

      await Deno.writeTextFile(token_merchant, newToken);
    })
    .finally(async () => await disconnectDatabase());
});

let token: any = null;

await Deno.test("Auth, Login User (Positive) : customer logged", async () => {
  await connectDatabase(Mongo.url);

  await superdeno(app)
    .post(`/api/auth/v1/login`)
    .send({
      username: user_customer_testing.username,
      password: user_customer_testing.password,
    })
    .expect(Status.OK)
    .then(({ body }) => {
      const { message, success, data } = body;
      assertEquals(message, "OK");
      assertEquals(success, true);

      const { permissions, role, token: newToken, userId } = data;
      assertEquals(isArrayOfString(permissions), true);
      assertEquals(isString(role), true);
      assertEquals(isString(newToken), true);
      assertEquals(isString(userId), true);

      token = newToken;
    })
    .finally(async () => await disconnectDatabase());
});

await Deno.test(
  "Auth, Logout User (Positive) : customer test logout",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .delete(`/api/auth/v1/logout`)
      .set("Authorization", `Bearer ${token}`)
      // .expect(Status.OK)
      .then(({ body }) => {
        const { message, success } = body;
        assertEquals(message, "berhasil logout");
        assertEquals(success, true);
      })
      .finally(async () => await disconnectDatabase());
  }
);

await Deno.test(
  "Auth, Login User (Positive) : customer login again",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .post(`/api/auth/v1/login`)
      .send({
        username: user_customer_testing.username,
        password: user_customer_testing.password,
      })
      .expect(Status.OK)
      .then(({ body }) => {
        const { message, success, data } = body;
        assertEquals(message, "OK");
        assertEquals(success, true);

        const { permissions, role, token: newToken, userId } = data;
        assertEquals(isArrayOfString(permissions), true);
        assertEquals(isString(role), true);
        assertEquals(isString(newToken), true);
        assertEquals(isString(userId), true);

        token = newToken;
      })
      .finally(async () => await disconnectDatabase());
  }
);

// // ================================================================================================================ //
// // -> Token Validation

await Deno.test(
  "Auth, Token Validation (Negative) : no token in header",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .get(`/api/auth/v1/token-validation`)
      .expect(Status.Forbidden)
      .then(({ body }) => {
        const { message, success } = body;
        assertEquals(message, "Authorization is required!");
        assertEquals(success, false);
      })
      .finally(async () => await disconnectDatabase());
  }
);

await Deno.test("Auth, Token Validation (Negative) : wrong token", async () => {
  await connectDatabase(Mongo.url);

  await superdeno(app)
    .get(`/api/auth/v1/token-validation`)
    .set("Authorization", `Bearer 123456789`)
    .expect(Status.Unauthorized)
    .then(({ body }) => {
      const { message, success } = body;
      assertEquals(message, "Not Authorized");
      assertEquals(success, false);
    })
    .finally(async () => await disconnectDatabase());
});

await Deno.test(
  "Auth, Token Validation (Positive) : get data on token",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .get(`/api/auth/v1/token-validation`)
      .set("Authorization", `Bearer ${token}`)
      .expect(Status.OK)
      .then(({ body }) => {
        const { message, success, data } = body;
        assertEquals(message, "OK");
        assertEquals(success, true);

        const { id, role, iat, exp, jti } = data;
        assertEquals(isString(id), true);
        assertEquals(isString(role), true);
        assertEquals(isNumber(iat), true);
        assertEquals(isNumber(exp), true);
        assertEquals(isString(jti), true);
      })
      .finally(async () => await disconnectDatabase());
  }
);

// // ================================================================================================================ //
// // -> Reset Password

await Deno.test(
  "Auth, Reset Password Request (Negative) : wrong body",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .post(`/api/auth/v1/reset-password`)
      .send({
        username: 123,
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(Status.UnprocessableEntity)
      .then(({ body }) => {
        const { message, success, data } = body;
        assertEquals(message, "Validation error");
        assertEquals(success, false);
        assertEquals(data[0].message, "Expected string, received number");
      })
      .finally(async () => await disconnectDatabase());
  }
);

await Deno.test(
  "Auth, Reset Password Request (Negative) : wrong username",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .post(`/api/auth/v1/reset-password`)
      .send({ username: "nggak_ada_username" })
      .set("Authorization", `Bearer ${token}`)
      .expect(Status.NotFound)
      .then(({ body }) => {
        const { message, success } = body;
        assertEquals(message, "user tidak ditemukan!");
        assertEquals(success, false);
      })
      .finally(async () => await disconnectDatabase());
  }
);

let ref_code: any = null;
await Deno.test(
  "Auth, Reset Password Request (Positive) : success superdeno",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .post(`/api/auth/v1/reset-password`)
      .send({ username: user_customer_testing.username })
      .set("Authorization", `Bearer ${token}`)
      .expect(Status.OK)
      .then(({ body }) => {
        const { message, success, data } = body;
        assertEquals(
          message,
          "sukses mengirimkan link reset password di email anda!"
        );
        assertEquals(success, true);

        const { ref } = data;
        assertEquals(isString(ref), true);
        ref_code = ref;
      })
      .finally(async () => await disconnectDatabase());
  }
);

await Deno.test(
  "Auth, Submit Password Request (Negative) : wrong body",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .put(`/api/auth/v1/reset-password`)
      .send({
        ref: "123456",
        password: "test",
        newPassword: "test",
        rePassword: "uye",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(Status.UnprocessableEntity)
      .then(({ body }) => {
        const { statusCode, message, success, data } = body;
        assertEquals(statusCode, Status.UnprocessableEntity);
        assertEquals(message, "Validation error");
        assertEquals(success, false);
        assertEquals(data[0].message, "Password harus minimal 8 karakter!");
        assertEquals(data[1].message, "Password harus minimal 8 karakter!");
        assertEquals(data[2].message, "Password harus minimal 8 karakter!");
        assertEquals(data[3].message, "harus berupa UUID v4 yang valid!");
        assertEquals(
          data[4].message,
          "Password harus memiliki setidaknya 1 huruf besar!"
        );
        assertEquals(
          data[5].message,
          "Password harus memiliki setidaknya 1 huruf besar!"
        );
        assertEquals(
          data[6].message,
          "Password harus memiliki setidaknya 1 huruf besar!"
        );
        assertEquals(
          data[7].message,
          "Password harus memiliki setidaknya 1 angka!"
        );
        assertEquals(
          data[8].message,
          "Password harus memiliki setidaknya 1 angka!"
        );
        assertEquals(
          data[9].message,
          "Password harus memiliki setidaknya 1 angka!"
        );
        assertEquals(
          data[10].message,
          "Password harus memiliki setidaknya 1 simbol!"
        );
        assertEquals(
          data[11].message,
          "Password harus memiliki setidaknya 1 simbol!"
        );
        assertEquals(
          data[12].message,
          "Password harus memiliki setidaknya 1 simbol!"
        );
      })
      .finally(async () => await disconnectDatabase());
  }
);

await Deno.test(
  "Auth, Reset Password Submit (Negative) : wrong ref code",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .put(`/api/auth/v1/reset-password`)
      .send({
        ref: "3b95aec7-1a2b-4593-a3c1-642ee8f27d95",
        password: user_customer_testing.password,
        newPassword: user_customer_testing.password + "0",
        rePassword: user_customer_testing.password + "0",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(Status.NotFound)
      .then(({ body }) => {
        const { message, success } = body;
        assertEquals(message, "referensi tidak ditemukan!");
        assertEquals(success, false);
      })
      .finally(async () => await disconnectDatabase());
  }
);

await Deno.test(
  "Auth, Reset Password Submit (Positive) : success reset password",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .put(`/api/auth/v1/reset-password`)
      .send({
        ref: ref_code,
        password: user_customer_testing.password,
        newPassword: user_customer_testing.password + "change",
        rePassword: user_customer_testing.password + "change",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(Status.OK)
      .then(({ body }) => {
        const { message, success, data } = body;
        assertEquals(message, "password anda berhasil dirubah!");
        assertEquals(success, true);
        assertEquals(data, []);
      })
      .finally(async () => await disconnectDatabase());
  }
);

await Deno.test(
  "Auth, Token Validation (Negative) : invalid session after reset password",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .get(`/api/auth/v1/token-validation`)
      .set("Authorization", `Bearer ${token}`)
      .expect(Status.BadRequest)
      .then(({ body }) => {
        const { statusCode, message, success } = body;
        assertEquals(statusCode, Status.BadRequest);
        assertEquals(message, "invalid session!");
        assertEquals(success, false);
      })
      .finally(async () => await disconnectDatabase());
  }
);

await Deno.test(
  "Auth, Login User (Positive) : customer login after reset password",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .post(`/api/auth/v1/login`)
      .send({
        username: user_customer_testing.username,
        password: user_customer_testing.password + "change",
      })
      .expect(Status.OK)
      .then(async ({ body }) => {
        const { message, success, data } = body;
        assertEquals(message, "OK");
        assertEquals(success, true);

        const { permissions, role, token: newToken, userId } = data;
        assertEquals(isArrayOfString(permissions), true);
        assertEquals(isString(role), true);
        assertEquals(isString(newToken), true);
        assertEquals(isString(userId), true);

        await Deno.writeTextFile(token_customer, newToken);
        token = newToken;
      })
      .finally(async () => await disconnectDatabase());
  }
);
