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

// ==================================================================================

export const userUpdateSchema = {
  body: z.object({
    name: name.optional(),
    profile_image: profile_image.optional(),
  }),
};
const schemaUserUpdate = z.object(userUpdateSchema);
export type UserUpdateSchema = z.TypeOf<typeof schemaUserUpdate>;
