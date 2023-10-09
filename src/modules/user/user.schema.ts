import { z } from "npm:zod@3.22.1";
import {
  username,
  password,
  name,
  profile_image,
  uuid_format,
} from "../../contracts/schema.contract.ts";

export const userSchema = z.object({
  params: z.object({}),
  body: z.object({}),
  query: z.object({}),
});
export type UserSchema = z.TypeOf<typeof userSchema>;

export const userAddressSchema = z.object({
  params: z.object({}),
  body: z.object({}),
  query: z.object({}),
});
export type UserAddressSchema = z.TypeOf<typeof userAddressSchema>;

// ==================================================================================

export const userUpdateSchema = z.object({
  body: z.object({
    name: name.optional(),
    profile_image: profile_image.optional(),
  }),
});
export type UserUpdateSchema = z.TypeOf<typeof userUpdateSchema>;

export const userAddressCreateSchema = z.object({
  body: z.object({
    title: z.string(),
    full: z.string(),
    coordinate: z.array(z.string()).length(2),
    postcode: z.string().length(5),

    // raja ongkir detail...
    rajaongkirCode: z.string(),
  }),
});
export type UserAddressCreateSchema = z.TypeOf<typeof userAddressCreateSchema>;

export const userAddressUpdateSchema = z.object({
  params: z.object({
    addressId: z.string(),
  }),
  body: z.object({
    title: z.string().optional(),
    full: z.string().optional(),
    coordinate: z.array(z.string()).length(2).optional(),
    postcode: z.string().length(5).optional(),

    // raja ongkir detail...
    rajaongkirCode: z.string().optional(),
  }),
});
export type UserAddressUpdateSchema = z.TypeOf<typeof userAddressUpdateSchema>;
