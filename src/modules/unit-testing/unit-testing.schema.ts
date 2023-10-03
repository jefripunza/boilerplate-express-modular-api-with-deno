import { z } from "npm:zod@3.22.1";
import { username } from "../../contracts/schema.contract.ts";

export const unitTestingSchema = {
  params: z.object({}),
  body: z.object({}),
  query: z.object({}),
};
const schemaUnitTesting = z.object(unitTestingSchema);
export type UnitTestingSchema = z.TypeOf<typeof schemaUnitTesting>;

// ==================================================================================

export const unitTestingDeleteUserSchema = {
  params: z.object({
    username,
  }),
};
const schemaUnitTestingDeleteUser = z.object(unitTestingDeleteUserSchema);
export type UnitTestingDeleteUserSchema = z.TypeOf<
  typeof schemaUnitTestingDeleteUser
>;
