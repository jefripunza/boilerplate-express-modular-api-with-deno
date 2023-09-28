import mongoose, {
  Document,
  InferSchemaType,
  model as createModel,
  Schema,
} from "npm:mongoose@^6.7";
import { insertDocument } from "../../apps/mongoose.ts";

export enum Role {
  All = "*",

  SuperAdmin = "SUPERADMIN",
  Admin = "ADMIN",
  Merchant = "MERCHANT",
  Customer = "CUSTOMER",
}

const UserRoleSchema = new Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      enum: Object.values(Role).filter((role) => role != Role.All),
      unique: true,
      required: true,
    },
    isActive: {
      type: mongoose.Schema.Types.Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "userRoles",
  }
);

export type UserRole = InferSchemaType<typeof UserRoleSchema> & Document;
const UserRoleModel = createModel<UserRole>("UserRole", UserRoleSchema);
export default UserRoleModel;

export async function up() {
  const roles = [
    {
      name: Role.SuperAdmin,
      isActive: true,
    },
    {
      name: Role.Admin,
      isActive: true,
    },
    {
      name: Role.Merchant,
      isActive: true,
    },
    {
      name: Role.Customer,
      isActive: true,
    },
  ];

  for (const role of roles) {
    await insertDocument(
      UserRoleModel,
      {
        name: role.name,
      },
      role
    );
  }
}
