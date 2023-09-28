import { z } from "npm:zod@3.22.1";

export const uuid_format = z
  .string()
  .refine(
    (value) =>
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
        value
      ),
    {
      message: "harus berupa UUID v4 yang valid!",
    }
  );

// ==========================================================================
// ~> Auth

export const username = z
  .string()
  .min(6, "username min 6 karakter!")
  .max(13, "username min 13 karakter!");
export const password = z
  .string()
  .min(8, "Password harus minimal 8 karakter!")
  .refine((value) => /[a-z]/.test(value), {
    message: "Password harus memiliki setidaknya 1 huruf kecil!",
    path: ["password"],
  })
  .refine((value) => /[A-Z]/.test(value), {
    message: "Password harus memiliki setidaknya 1 huruf besar!",
    path: ["password"],
  })
  .refine((value) => /[0-9]/.test(value), {
    message: "Password harus memiliki setidaknya 1 angka!",
    path: ["password"],
  })
  .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
    message: "Password harus memiliki setidaknya 1 simbol!",
    path: ["password"],
  });

// ==========================================================================
// ~> User

export const name = z.string().min(3, "nama min 3 karakter!");
export const profile_image = z.string().optional();
