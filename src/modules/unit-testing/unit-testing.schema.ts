import { z } from "npm:zod@3.22.1";
import { username } from "../../contracts/schema.contract.ts";

export const unitTestingSchema = z.object({
  params: z.object({}),
  body: z.object({}),
  query: z.object({}),
});
export type UnitTestingSchema = z.TypeOf<typeof unitTestingSchema>;

// ==================================================================================

export const unitTestingDeleteUserSchema = z.object({
  params: z.object({
    username,
  }),
});
export type UnitTestingDeleteUserSchema = z.TypeOf<
  typeof unitTestingDeleteUserSchema
>;
