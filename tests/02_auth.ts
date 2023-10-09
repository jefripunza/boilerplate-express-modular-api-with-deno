import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";
import { StatusCodes } from "npm:http-status-codes@2.2.0";

import axios from "npm:axios@1.4.0";
import { getUrlDev } from "../src/utils/unit_test.ts";

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

const token_admin = "tests/token-admin.txt";
const token_merchant = "tests/token-merchant.txt";
const token_customer = "tests/token-customer.txt";

let token: any = null;

// ================================================================================================================ //
// -> Register New User

Deno.test(
  "Auth, Register New User (Negative) : wrong body format",
  async () => {
    try {
      await axios.post(`${getUrlDev}/api/auth/v1/register`, {
        username: 1234567890,
        password: "uyee",

        name: "hm",
        profile_image: "",
      });
    } catch (error) {
      const { statusCode, message, success, data } = error.response.data;
      assertEquals(statusCode, StatusCodes.UNPROCESSABLE_ENTITY);
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
    }
  }
);

Deno.test(
  "Auth, Register New User (Positive) : user admin created",
  async () => {
    try {
      const result = await axios
        .post(`${getUrlDev}/api/auth/v1/register`, user_admin_testing)
        .then((res) => res.data);
      assertEquals(result.statusCode, StatusCodes.CREATED);
      assertEquals(result.message, "OK");
      assertEquals(result.success, true);
      assertEquals(result.data, []);
    } catch (error) {
      const { statusCode, message, success, data } = error.response.data;
      console.log({ statusCode, message, data });
      assertEquals(statusCode, StatusCodes.CREATED);
    }
  }
);

Deno.test(
  "Auth, Register New User (Positive) : user merchant created",
  async () => {
    try {
      const result = await axios
        .post(`${getUrlDev}/api/auth/v1/register`, user_merchant_testing)
        .then((res) => res.data);
      assertEquals(result.statusCode, StatusCodes.CREATED);
      assertEquals(result.message, "OK");
      assertEquals(result.success, true);
      assertEquals(result.data, []);
    } catch (error) {
      const { statusCode, message, success, data } = error.response.data;
      console.log({ statusCode, message, data });
      assertEquals(statusCode, StatusCodes.CREATED);
    }
  }
);

Deno.test(
  "Auth, Register New User (Positive) : user customer created",
  async () => {
    try {
      const result = await axios
        .post(`${getUrlDev}/api/auth/v1/register`, user_customer_testing)
        .then((res) => res.data);
      assertEquals(result.statusCode, StatusCodes.CREATED);
      assertEquals(result.message, "OK");
      assertEquals(result.success, true);
      assertEquals(result.data, []);
    } catch (error) {
      const { statusCode, message, success, data } = error.response.data;
      console.log({ statusCode, message, data });
      assertEquals(statusCode, StatusCodes.CREATED);
    }
  }
);

Deno.test(
  "Auth, Register New User (Negative) : user is already register",
  async () => {
    try {
      await axios
        .post(`${getUrlDev}/api/auth/v1/register`, user_customer_testing)
        .then((res) => res.data);
    } catch (error) {
      const { statusCode, message, success, data } = error.response.data;
      assertEquals(statusCode, StatusCodes.BAD_REQUEST);
      assertEquals(message, "user sudah terdaftar!");
      assertEquals(success, false);
    }
  }
);

// ================================================================================================================ //
// -> Login User

Deno.test("Auth, Login User (Negative) : wrong body", async () => {
  try {
    await axios
      .post(`${getUrlDev}/api/auth/v1/login`, {
        username: "anu",
        password: "test",
      })
      .then((res) => res.data);
  } catch (error) {
    const { statusCode, message, success, data } = error.response.data;
    assertEquals(statusCode, StatusCodes.UNPROCESSABLE_ENTITY);
    assertEquals(message, "Validation error");
    assertEquals(success, false);
    assertEquals(data[0].message, "username min 6 karakter!");
  }
});

Deno.test("Auth, Login User (Negative) : wrong username", async () => {
  try {
    await axios
      .post(`${getUrlDev}/api/auth/v1/login`, {
        username: "user_customer_testing.username",
        password: user_customer_testing.password,
      })
      .then((res) => res.data);
  } catch (error) {
    const { statusCode, message, success, data } = error.response.data;
    assertEquals(statusCode, StatusCodes.UNPROCESSABLE_ENTITY);
    assertEquals(message, "Validation error");
    assertEquals(success, false);
    assertEquals(data[0].message, "username max 25 karakter!");
  }
});

Deno.test("Auth, Login User (Negative) : wrong password", async () => {
  try {
    await axios
      .post(`${getUrlDev}/api/auth/v1/login`, {
        username: user_customer_testing.username,
        password: "test",
      })
      .then((res) => res.data);
  } catch (error) {
    const { statusCode, message, success, data } = error.response.data;
    assertEquals(statusCode, StatusCodes.UNPROCESSABLE_ENTITY);
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
  }
});

Deno.test("Auth, Login User (Positive) : admin logged", async () => {
  try {
    const result = await axios
      .post(`${getUrlDev}/api/auth/v1/login`, {
        username: user_admin_testing.username,
        password: user_admin_testing.password,
      })
      .then((res) => res.data);
    assertEquals(result.statusCode, StatusCodes.OK);
    assertEquals(result.message, "OK");
    assertEquals(result.success, true);

    const { permissions, role, token: newToken, userId } = result.data;
    assertEquals(isArrayOfString(permissions), true);
    assertEquals(isString(role), true);
    assertEquals(isString(newToken), true);
    assertEquals(isString(userId), true);

    await Deno.writeTextFile(token_admin, newToken);
  } catch (error) {
    const { statusCode, message, success, data } = error.response.data;
    console.log({ statusCode, message, data });
    assertEquals(statusCode, StatusCodes.OK);
  }
});

Deno.test("Auth, Login User (Positive) : merchant logged", async () => {
  try {
    const result = await axios
      .post(`${getUrlDev}/api/auth/v1/login`, {
        username: user_merchant_testing.username,
        password: user_merchant_testing.password,
      })
      .then((res) => res.data);
    assertEquals(result.statusCode, StatusCodes.OK);
    assertEquals(result.message, "OK");
    assertEquals(result.success, true);

    const { permissions, role, token: newToken, userId } = result.data;
    assertEquals(isArrayOfString(permissions), true);
    assertEquals(isString(role), true);
    assertEquals(isString(newToken), true);
    assertEquals(isString(userId), true);

    await Deno.writeTextFile(token_merchant, newToken);
  } catch (error) {
    const { statusCode, message, success, data } = error.response.data;
    console.log({ statusCode, message, data });
    assertEquals(statusCode, StatusCodes.OK);
  }
});

Deno.test("Auth, Login User (Positive) : customer logged", async () => {
  try {
    const result = await axios
      .post(`${getUrlDev}/api/auth/v1/login`, {
        username: user_customer_testing.username,
        password: user_customer_testing.password,
      })
      .then((res) => res.data);
    assertEquals(result.statusCode, StatusCodes.OK);
    assertEquals(result.message, "OK");
    assertEquals(result.success, true);

    const { permissions, role, token: newToken, userId } = result.data;
    assertEquals(isArrayOfString(permissions), true);
    assertEquals(isString(role), true);
    assertEquals(isString(newToken), true);
    assertEquals(isString(userId), true);

    token = newToken;
  } catch (error) {
    const { statusCode, message, success, data } = error.response.data;
    console.log({ statusCode, message, data });
    assertEquals(statusCode, StatusCodes.OK);
  }
});

Deno.test("Auth, Logout User (Positive) : customer test logout", async () => {
  try {
    const result = await axios
      .delete(`${getUrlDev}/api/auth/v1/logout`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data);
    assertEquals(result.statusCode, StatusCodes.OK);
    assertEquals(result.message, "berhasil logout");
    assertEquals(result.success, true);
  } catch (error) {
    const { statusCode, message, success, data } = error.response.data;
    console.log({ statusCode, message, data });
    assertEquals(statusCode, StatusCodes.OK);
  }
});

Deno.test("Auth, Login User (Positive) : customer login again", async () => {
  try {
    const result = await axios
      .post(`${getUrlDev}/api/auth/v1/login`, {
        username: user_customer_testing.username,
        password: user_customer_testing.password,
      })
      .then((res) => res.data);
    assertEquals(result.statusCode, StatusCodes.OK);
    assertEquals(result.message, "OK");
    assertEquals(result.success, true);

    const { permissions, role, token: newToken, userId } = result.data;
    assertEquals(isArrayOfString(permissions), true);
    assertEquals(isString(role), true);
    assertEquals(isString(newToken), true);
    assertEquals(isString(userId), true);

    token = newToken;
  } catch (error) {
    const { statusCode, message, success, data } = error.response.data;
    console.log({ statusCode, message, data });
    assertEquals(statusCode, StatusCodes.OK);
  }
});

// ================================================================================================================ //
// -> Token Validation

Deno.test(
  "Auth, Token Validation (Negative) : no token in header",
  async () => {
    try {
      await axios
        .get(`${getUrlDev}/api/auth/v1/token-validation`)
        .then((res) => res.data);
    } catch (error) {
      const { statusCode, message, success, data } = error.response.data;
      assertEquals(statusCode, StatusCodes.FORBIDDEN);
      assertEquals(message, "Authorization is required!");
      assertEquals(success, false);
    }
  }
);

Deno.test("Auth, Token Validation (Negative) : wrong token", async () => {
  try {
    await axios
      .get(`${getUrlDev}/api/auth/v1/token-validation`, {
        headers: { Authorization: `Bearer awowkwkwkkkk` },
      })
      .then((res) => res.data);
  } catch (error) {
    const { statusCode, message, success, data } = error.response.data;
    assertEquals(statusCode, StatusCodes.UNAUTHORIZED);
    assertEquals(message, "Not Authorized");
    assertEquals(success, false);
  }
});

Deno.test("Auth, Token Validation (Positive) : get data on token", async () => {
  try {
    const result = await axios
      .get(`${getUrlDev}/api/auth/v1/token-validation`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data);
    assertEquals(result.statusCode, StatusCodes.OK);
    assertEquals(result.message, "OK");
    assertEquals(result.success, true);

    const { id, role, iat, exp, jti } = result.data;
    assertEquals(isString(id), true);
    assertEquals(isString(role), true);
    assertEquals(isNumber(iat), true);
    assertEquals(isNumber(exp), true);
    assertEquals(isString(jti), true);
  } catch (error) {
    const { statusCode, message, success, data } = error.response.data;
    console.log({ statusCode, message, success, data });
    assertEquals(statusCode, StatusCodes.OK);
  }
});

// ================================================================================================================ //
// -> Reset Password

Deno.test("Auth, Reset Password Request (Negative) : wrong body", async () => {
  try {
    await axios
      .post(
        `${getUrlDev}/api/auth/v1/reset-password`,
        {
          username: 123,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => res.data);
  } catch (error) {
    const { statusCode, message, success, data } = error.response.data;
    assertEquals(statusCode, StatusCodes.UNPROCESSABLE_ENTITY);
    assertEquals(message, "Validation error");
    assertEquals(success, false);
    assertEquals(data[0].message, "Expected string, received number");
  }
});

Deno.test(
  "Auth, Reset Password Request (Negative) : wrong username",
  async () => {
    try {
      await axios
        .post(
          `${getUrlDev}/api/auth/v1/reset-password`,
          { username: "nggak_ada_username" },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => res.data);
    } catch (error) {
      const { statusCode, message, success, data } = error.response.data;
      assertEquals(statusCode, StatusCodes.NOT_FOUND);
      assertEquals(message, "user tidak ditemukan!");
      assertEquals(success, false);
    }
  }
);

let ref_code: any = null;
Deno.test(
  "Auth, Reset Password Request (Positive) : success request",
  async () => {
    try {
      const result = await axios
        .post(
          `${getUrlDev}/api/auth/v1/reset-password`,
          { username: user_customer_testing.username },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => res.data);
      assertEquals(result.statusCode, StatusCodes.OK);
      assertEquals(
        result.message,
        "sukses mengirimkan link reset password di email anda!"
      );
      assertEquals(result.success, true);

      const { ref } = result.data;
      assertEquals(isString(ref), true);
      ref_code = ref;
    } catch (error) {
      const { statusCode, message, success, data } = error.response.data;
      console.log({ statusCode, message, success, data });
      assertEquals(statusCode, StatusCodes.OK);
    }
  }
);

Deno.test("Auth, Submit Password Request (Negative) : wrong body", async () => {
  try {
    await axios
      .put(
        `${getUrlDev}/api/auth/v1/reset-password`,
        {
          ref: "123456",
          password: "test",
          newPassword: "test",
          rePassword: "uye",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => res.data);
  } catch (error) {
    const { statusCode, message, success, data } = error.response.data;
    assertEquals(statusCode, StatusCodes.UNPROCESSABLE_ENTITY);
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
  }
});

Deno.test(
  "Auth, Reset Password Submit (Negative) : wrong ref code",
  async () => {
    try {
      await axios
        .put(
          `${getUrlDev}/api/auth/v1/reset-password`,
          {
            ref: "3b95aec7-1a2b-4593-a3c1-642ee8f27d95",
            password: user_customer_testing.password,
            newPassword: user_customer_testing.password + "0",
            rePassword: user_customer_testing.password + "0",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => res.data);
    } catch (error) {
      const { statusCode, message, success, data } = error.response.data;
      assertEquals(statusCode, StatusCodes.NOT_FOUND);
      assertEquals(message, "referensi tidak ditemukan!");
      assertEquals(success, false);
    }
  }
);

Deno.test(
  "Auth, Reset Password Submit (Positive) : success reset password",
  async () => {
    try {
      const result = await axios
        .put(
          `${getUrlDev}/api/auth/v1/reset-password`,
          {
            ref: ref_code,
            password: user_customer_testing.password,
            newPassword: user_customer_testing.password + "change",
            rePassword: user_customer_testing.password + "change",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => res.data);
      assertEquals(result.statusCode, StatusCodes.OK);
      assertEquals(result.message, "password anda berhasil dirubah!");
      assertEquals(result.success, true);
      assertEquals(result.data, []);
    } catch (error) {
      const { statusCode, message, success, data } = error.response.data;
      console.log({ statusCode, message, success, data });
      assertEquals(statusCode, StatusCodes.OK);
    }
  }
);

Deno.test(
  "Auth, Token Validation (Negative) : invalid session after reset password",
  async () => {
    try {
      await axios
        .get(`${getUrlDev}/api/auth/v1/token-validation`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => res.data);
    } catch (error) {
      const { statusCode, message, success, data } = error.response.data;
      assertEquals(statusCode, StatusCodes.BAD_REQUEST);
      assertEquals(message, "invalid session!");
      assertEquals(success, false);
    }
  }
);

Deno.test(
  "Auth, Login User (Positive) : customer login after reset password",
  async () => {
    try {
      const result = await axios
        .post(`${getUrlDev}/api/auth/v1/login`, {
          username: user_customer_testing.username,
          password: user_customer_testing.password + "change",
        })
        .then((res) => res.data);
      assertEquals(result.statusCode, StatusCodes.OK);
      assertEquals(result.message, "OK");
      assertEquals(result.success, true);

      const { permissions, role, token: newToken, userId } = result.data;
      assertEquals(isArrayOfString(permissions), true);
      assertEquals(isString(role), true);
      assertEquals(isString(newToken), true);
      assertEquals(isString(userId), true);

      await Deno.writeTextFile(token_customer, newToken);
      token = newToken;
    } catch (error) {
      const { statusCode, message, success, data } = error.response.data;
      console.log({ statusCode, message, data });
      assertEquals(statusCode, StatusCodes.OK);
    }
  }
);
