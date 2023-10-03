import { z } from "npm:zod@3.22.1";
import {
  username,
  password,
  name,
  profile_image,
  uuid_format,
} from "../../contracts/schema.contract.ts";

export const userSchema = {
  params: z.object({}),
  body: z.object({}),
  query: z.object({}),
};
const schemaUser = z.object(userSchema);
export type UserSchema = z.TypeOf<typeof schemaUser>;

export const userAddressSchema = {
  params: z.object({}),
  body: z.object({}),
  query: z.object({}),
};
const schemaUserAddress = z.object(userAddressSchema);
export type UserAddressSchema = z.TypeOf<typeof schemaUserAddress>;

// ==================================================================================

export const userUpdateSchema = {
  body: z.object({
    name: name.optional(),
    profile_image: profile_image.optional(),
  }),
};
const schemaUserUpdate = z.object(userUpdateSchema);
export type UserUpdateSchema = z.TypeOf<typeof schemaUserUpdate>;

export const userAddressCreateSchema = {
  body: z.object({
    title: z.string(),
    full: z.string(),
    coordinate: z.array(z.string()).length(2),
    postcode: z.string().length(5),

    // raja ongkir detail...
    rajaongkir_code: z.string(),
  }),
};
const schemaUserAddressCreate = z.object(userAddressCreateSchema);
export type UserAddressCreateSchema = z.TypeOf<typeof schemaUserAddressCreate>;

export const userAddressUpdateSchema = {
  params: z.object({
    addressId: z.string(),
  }),
  body: z.object({
    title: z.string().optional(),
    full: z.string().optional(),
    coordinate: z.array(z.string()).length(2).optional(),
    postcode: z.string().length(5).optional(),

    // raja ongkir detail...
    rajaongkir_code: z.string().optional(),
  }),
};
const schemaUserAddressUpdate = z.object(userAddressUpdateSchema);
export type UserAddressUpdateSchema = z.TypeOf<typeof schemaUserAddressUpdate>;
