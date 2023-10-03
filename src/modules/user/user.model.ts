import mongoose, {
  Document,
  InferSchemaType,
  model,
  Schema,
} from "npm:mongoose@^6.7";

import UserRoleModel, { Role } from "../user-role/user-role.model.ts";

import * as encryption from "../../utils/encryption.ts";
import { insertDocument } from "../../apps/mongoose.ts";

const UserSchema = new Schema(
  {
    role: {
      type: mongoose.Schema.Types.String,
      ref: "UserRole",
      required: true,
    },

    username: {
      type: mongoose.Schema.Types.String,
      required: true,
      unique: true,
    },
    password: { type: mongoose.Schema.Types.String, required: true },

    name: { type: mongoose.Schema.Types.String, required: true },
    profile_image: { type: mongoose.Schema.Types.String },

    // forgot password
    forgot_password_ref: { type: mongoose.Schema.Types.String },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export type User = InferSchemaType<typeof UserSchema> & Document;
const UserModel = model<User>("User", UserSchema);
export default UserModel;

export async function up() {
  // clear all data...
  await UserModel.deleteMany({});

  const role = await UserRoleModel.findOne({
    name: Role.SuperAdmin,
  });

  await insertDocument(
    UserModel,
    {
      username: "superadmin",
    },
    {
      role: role?._id.toString(),
      username: "superadmin",
      password: encryption.encode("hanyaakuyangtau@123OK"),
      name: "Super Admin",
    }
  );
}
