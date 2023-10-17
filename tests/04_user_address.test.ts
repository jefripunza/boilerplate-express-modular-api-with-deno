import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";
import {
  beforeAll,
  afterAll,
} from "https://deno.land/std@0.204.0/testing/bdd.ts";
import { superdeno } from "https://deno.land/x/superdeno/mod.ts";
import { app } from "../src/apps/opine.ts";
import { Status } from "https://deno.land/x/opine@2.3.4/deps.ts";

import { user_customer_testing } from "../src/config.ts";
import { isString } from "../src/helpers/validation.ts";

import { Mongo } from "../src/env.ts";
import { connectDatabase, disconnectDatabase } from "../src/apps/mongoose.ts";

const token_admin = await Deno.readTextFile("tests/token-admin.txt");
const token_merchant = await Deno.readTextFile("tests/token-merchant.txt");
const token_customer = await Deno.readTextFile("tests/token-customer.txt");

// ======================================================================== //
// -> User Address

let addressId: any = null;

Deno.test(
  "User, Address Create (Positive) : create new address is default",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .post(`/api/user/v1/address`)
      .send({
        title: "Test Address",
        full: "Sokowaten, Tamanan, Banguntapan, Bantul, D.I Yogyakarta",
        coordinate: ["123.435435", "33.454354"],
        postcode: "35356",
        rajaongkirCode: "DTO123",
      })
      .set("Authorization", `Bearer ${token_customer}`)
      .expect(Status.Created)
      .then(({ body }) => {
        const { message, success, data } = body;
        assertEquals(message, "success create new address");
        assertEquals(success, true);

        const { id } = data;
        assertEquals(isString(id), true);
      })
      .finally(async () => await disconnectDatabase());
  }
);

Deno.test(
  "User, Address Create (Positive) : create new address on second choice",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .post(`/api/user/v1/address`)
      .send({
        title: "Test Address 2",
        full: "Sleman, D.I Yogyakarta",
        coordinate: ["234.45436", "11.454355"],
        postcode: "65654",
        rajaongkirCode: "YUH456",
      })
      .set("Authorization", `Bearer ${token_customer}`)
      .expect(Status.Created)
      .then(({ body }) => {
        const { message, success, data } = body;
        assertEquals(message, "success create new address");
        assertEquals(success, true);

        const { id } = data;
        assertEquals(isString(id), true);
        addressId = id;
      })
      .finally(async () => await disconnectDatabase());
  }
);

Deno.test(
  "User, Address List (Positive) : list address after create 2 address",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .get(`/api/user/v1/address`)
      .set("Authorization", `Bearer ${token_customer}`)
      .expect(Status.OK)
      .then(({ body }) => {
        const { message, success, data } = body;
        assertEquals(message, "OK");
        assertEquals(success, true);
        assertEquals(data.length, 2);
        assertEquals(data[0].title, "Test Address");
        assertEquals(
          data[0].full,
          "Sokowaten, Tamanan, Banguntapan, Bantul, D.I Yogyakarta"
        );
        assertEquals(data[0].rajaongkirCode, "DTO123");
      })
      .finally(async () => await disconnectDatabase());
  }
);

Deno.test(
  "User, Address Update (Positive) : update specific address",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .put(`/api/user/v1/address/${addressId}`)
      .send({
        title: "Test Address Updated",
        full: "Luar Angkasa",
        rajaongkirCode: "SIP123",
      })
      .set("Authorization", `Bearer ${token_customer}`)
      .expect(Status.OK)
      .then(({ body }) => {
        const { message, success } = body;
        assertEquals(message, "berhasil mengubah alamat");
        assertEquals(success, true);
      })
      .finally(async () => await disconnectDatabase());
  }
);

Deno.test(
  "User, Address List (Positive) : list address after update",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .get(`/api/user/v1/address`)
      .set("Authorization", `Bearer ${token_customer}`)
      .expect(Status.OK)
      .then(({ body }) => {
        const { message, success, data } = body;
        assertEquals(message, "OK");
        assertEquals(success, true);

        assertEquals(data[1].title, "Test Address Updated");
        assertEquals(data[1].full, "Luar Angkasa");
        assertEquals(data[1].rajaongkirCode, "SIP123");
      })
      .finally(async () => await disconnectDatabase());
  }
);

Deno.test(
  "User, Address Default (Positive) : update default address",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .patch(`/api/user/v1/address-set-default/${addressId}`)
      .set("Authorization", `Bearer ${token_customer}`)
      .expect(Status.OK)
      .then(({ body }) => {
        const { message, success } = body;
        assertEquals(message, "berhasil mengubah alamat yang digunakan");
        assertEquals(success, true);
      })
      .finally(async () => await disconnectDatabase());
  }
);

Deno.test(
  "User, Address Delete (Positive) : delete specific address",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .delete(`/api/user/v1/address/${addressId}`)
      .set("Authorization", `Bearer ${token_customer}`)
      .expect(Status.NoContent)
      .then(({ body }) => {
        assertEquals(body, null);
      })
      .finally(async () => await disconnectDatabase());
  }
);

Deno.test(
  "User, Address List (Positive) : list address after delete",
  async () => {
    await connectDatabase(Mongo.url);

    await superdeno(app)
      .get(`/api/user/v1/address`)
      .set("Authorization", `Bearer ${token_customer}`)
      .expect(Status.OK)
      .then(({ body }) => {
        const { message, success, data } = body;
        assertEquals(message, "OK");
        assertEquals(success, true);
        assertEquals(data.length, 1);
      })
      .finally(async () => await disconnectDatabase());
  }
);
