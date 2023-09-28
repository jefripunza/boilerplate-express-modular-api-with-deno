import { z } from "npm:zod@3.22.1";
import {
  name,
  password,
  profile_image,
  username,
  uuid_format,
} from "../../contracts/schema.contract.ts";

export const authSchema = {
  params: z.object({}),
  body: z.object({}),
  query: z.object({}),
};
const schemaAuth = z.object(authSchema);
export type AuthSchema = z.TypeOf<typeof schemaAuth>;

// ==================================================================================

export const authRegisterSchema = {
  body: z.object({
    username,
    password,

    name,
    profile_image,
  }),
};
const schemaAuthRegister = z.object(authRegisterSchema);
export type AuthRegisterSchema = z.TypeOf<typeof schemaAuthRegister>;

export const authLoginSchema = {
  body: z.object({
    username,
    password,
  }),
};
const schemaAuthLogin = z.object(authLoginSchema);
export type AuthLoginSchema = z.TypeOf<typeof schemaAuthLogin>;

export const authRequestResetPasswordSchema = {
  body: z.object({
    username,
  }),
};
const schemaAuthRequestResetPassword = z.object(authRequestResetPasswordSchema);
export type AuthRequestResetPasswordSchema = z.TypeOf<
  typeof schemaAuthRequestResetPassword
>;

export const authSubmitResetPasswordSchema = {
  body: z.object({
    ref: uuid_format,
    password,
    newPassword: password,
    rePassword: password,
  }),
};
const schemaAuthSubmitResetPassword = z.object(authSubmitResetPasswordSchema);
export type AuthSubmitResetPasswordSchema = z.TypeOf<
  typeof schemaAuthSubmitResetPassword
>;
