import { z } from "npm:zod@3.22.1";
import {
  name,
  password,
  profile_image,
  username,
  uuid_format,
} from "../../contracts/schema.contract.ts";

export const authSchema = z.object({
  params: z.object({}),
  body: z.object({}),
  query: z.object({}),
});
export type AuthSchema = z.TypeOf<typeof authSchema>;

// ==================================================================================

export const authRegisterSchema = z.object({
  body: z.object({
    username,
    password,

    name,
    profile_image,
  }),
});
export type AuthRegisterSchema = z.TypeOf<typeof authRegisterSchema>;

export const authLoginSchema = z.object({
  body: z.object({
    username,
    password,
  }),
});
export type AuthLoginSchema = z.TypeOf<typeof authLoginSchema>;

export const authRequestResetPasswordSchema = z.object({
  body: z.object({
    username,
  }),
});
export type AuthRequestResetPasswordSchema = z.TypeOf<
  typeof authRequestResetPasswordSchema
>;

export const authSubmitResetPasswordSchema = z.object({
  body: z.object({
    ref: uuid_format,
    password,
    newPassword: password,
    rePassword: password,
  }),
});
export type AuthSubmitResetPasswordSchema = z.TypeOf<
  typeof authSubmitResetPasswordSchema
>;
