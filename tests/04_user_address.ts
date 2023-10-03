import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";
import { StatusCodes } from "npm:http-status-codes@2.2.0";

import axios from "npm:axios@1.4.0";
import { getUrlDev } from "../src/utils/unit_test.ts";

import { user_customer_testing } from "../src/config.ts";
import { isString } from "../src/helpers/validation.ts";

const token_admin = await Deno.readTextFile("tests/token-admin.txt");
const token_customer = await Deno.readTextFile("tests/token-customer.txt");

// ======================================================================== //
// -> User Address

let addressId: any = null;

Deno.test(
  "User, Address Create (Positive) : create new address is default",
  async () => {
    try {
      const result = await axios
        .post(
          `${getUrlDev}/api/user/v1/address`,
          {
            title: "Test Address",
            full: "Sokowaten, Tamanan, Banguntapan, Bantul, D.I Yogyakarta",
            coordinate: ["123.435435", "33.454354"],
            postcode: "35356",
            rajaongkir_code: "DTO123",
          },
          {
            headers: { Authorization: `Bearer ${token_customer}` },
          }
        )
        .then((res) => res.data);
      assertEquals(result.statusCode, StatusCodes.CREATED);
      assertEquals(result.message, "success create new address");
      assertEquals(result.success, true);

      const { id } = result.data;
      assertEquals(isString(id), true);
    } catch (error) {
      const { statusCode, message, success, data } = error.response.data;
      console.log({ statusCode, message, success, data });
      assertEquals(statusCode, StatusCodes.OK);
    }
  }
);

Deno.test(
  "User, Address Create (Positive) : create new address on second choice",
  async () => {
    try {
      const result = await axios
        .post(
          `${getUrlDev}/api/user/v1/address`,
          {
            title: "Test Address 2",
            full: "Sleman, D.I Yogyakarta",
            coordinate: ["234.45436", "11.454355"],
            postcode: "65654",
            rajaongkir_code: "YUH456",
          },
          {
            headers: { Authorization: `Bearer ${token_customer}` },
          }
        )
        .then((res) => res.data);
      assertEquals(result.statusCode, StatusCodes.CREATED);
      assertEquals(result.message, "success create new address");
      assertEquals(result.success, true);

      const { id } = result.data;
      assertEquals(isString(id), true);
      addressId = id;
    } catch (error) {
      const { statusCode, message, success, data } = error.response.data;
      console.log({ statusCode, message, success, data });
      assertEquals(statusCode, StatusCodes.OK);
    }
  }
);

Deno.test(
  "User, Address List (Positive) : list address after create 2 address",
  async () => {
    try {
      const result = await axios
        .get(`${getUrlDev}/api/user/v1/address`, {
          headers: { Authorization: `Bearer ${token_customer}` },
        })
        .then((res) => res.data);
      assertEquals(result.statusCode, StatusCodes.OK);
      assertEquals(result.message, "OK");
      assertEquals(result.success, true);
      assertEquals(result.data.length, 2);
      assertEquals(result.data[0].title, "Test Address");
      assertEquals(
        result.data[0].full,
        "Sokowaten, Tamanan, Banguntapan, Bantul, D.I Yogyakarta"
      );
      assertEquals(result.data[0].rajaongkir_code, "DTO123");
    } catch (error) {
      const { statusCode, message, success, data } = error.response.data;
      console.log({ statusCode, message, success, data });
      assertEquals(statusCode, StatusCodes.OK);
    }
  }
);

Deno.test(
  "User, Address Update (Positive) : update specific address",
  async () => {
    try {
      const result = await axios
        .put(
          `${getUrlDev}/api/user/v1/address/${addressId}`,
          {
            title: "Test Address Updated",
            full: "Luar Angkasa",
            rajaongkir_code: "SIP123",
          },
          {
            headers: { Authorization: `Bearer ${token_customer}` },
          }
        )
        .then((res) => res.data);
      assertEquals(result.statusCode, StatusCodes.OK);
      assertEquals(result.message, "berhasil mengubah alamat");
      assertEquals(result.success, true);
    } catch (error) {
      const { statusCode, message, success, data } = error.response.data;
      console.log({ statusCode, message, success, data });
      assertEquals(statusCode, StatusCodes.OK);
    }
  }
);

Deno.test(
  "User, Address List (Positive) : list address after update",
  async () => {
    try {
      const result = await axios
        .get(`${getUrlDev}/api/user/v1/address`, {
          headers: { Authorization: `Bearer ${token_customer}` },
        })
        .then((res) => res.data);
      assertEquals(result.statusCode, StatusCodes.OK);
      assertEquals(result.message, "OK");
      assertEquals(result.success, true);
      assertEquals(result.data[1].title, "Test Address Updated");
      assertEquals(result.data[1].full, "Luar Angkasa");
      assertEquals(result.data[1].rajaongkir_code, "SIP123");
    } catch (error) {
      const { statusCode, message, success, data } = error.response.data;
      console.log({ statusCode, message, success, data });
      assertEquals(statusCode, StatusCodes.OK);
    }
  }
);

Deno.test(
  "User, Address Default (Positive) : update default address",
  async () => {
    try {
      const result = await axios
        .patch(
          `${getUrlDev}/api/user/v1/address-set-default/${addressId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token_customer}` },
          }
        )
        .then((res) => res.data);
      assertEquals(result.statusCode, StatusCodes.OK);
      assertEquals(result.message, "berhasil mengubah alamat yang digunakan");
      assertEquals(result.success, true);
    } catch (error) {
      const { statusCode, message, success, data } = error.response.data;
      console.log({ statusCode, message, success, data });
      assertEquals(statusCode, StatusCodes.OK);
    }
  }
);

Deno.test(
  "User, Address Delete (Positive) : delete specific address",
  async () => {
    try {
      const result = await axios
        .delete(`${getUrlDev}/api/user/v1/address/${addressId}`, {
          headers: { Authorization: `Bearer ${token_customer}` },
        })
        .then((res) => res.data);
      assertEquals(result.statusCode, StatusCodes.OK);
      assertEquals(result.message, "berhasil menghapus alamat");
      assertEquals(result.success, true);
    } catch (error) {
      const { statusCode, message, success, data } = error.response.data;
      console.log({ statusCode, message, success, data });
      assertEquals(statusCode, StatusCodes.OK);
    }
  }
);

Deno.test(
  "User, Address List (Positive) : list address after delete",
  async () => {
    try {
      const result = await axios
        .get(`${getUrlDev}/api/user/v1/address`, {
          headers: { Authorization: `Bearer ${token_customer}` },
        })
        .then((res) => res.data);
      assertEquals(result.statusCode, StatusCodes.OK);
      assertEquals(result.message, "OK");
      assertEquals(result.success, true);
      assertEquals(result.data.length, 1);
    } catch (error) {
      const { statusCode, message, success, data } = error.response.data;
      console.log({ statusCode, message, success, data });
      assertEquals(statusCode, StatusCodes.OK);
    }
  }
);
