import mongoose, {
  Document,
  InferSchemaType,
  model as createModel,
  Schema,
} from "npm:mongoose@^6.7";
import { insertDocument } from "../../apps/mongoose.ts";

import PermissionModel, {
  Permissions,
} from "../permission/permission.model.ts";
import UserRoleModel, { Role } from "./user-role.model.ts";
const Types = mongoose.Schema.Types;

const UserPermissionSchema = new Schema(
  {
    role: {
      type: Types.String,
      ref: "UserRole",
      required: true,
    },
    permission: {
      type: Types.String,
      ref: "Permission",
      required: true,
    },
    canAccess: {
      type: Types.Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "userPermission",
  }
);

export type UserPermission = InferSchemaType<typeof UserPermissionSchema> &
  Document;
const UserPermissionModel = createModel<UserPermission>(
  "UserPermission",
  UserPermissionSchema
);
export default UserPermissionModel;

export async function up() {
  // clear all data...
  await UserPermissionModel.deleteMany({});

  const permissions = await PermissionModel.find({});
  const roles = await UserRoleModel.find({});

  for (const permission of permissions) {
    for (const role of roles) {
      await insertDocument(
        UserPermissionModel,
        {
          permission: permission._id,
          role: role._id,
        },
        {
          permission: permission._id,
          role: role._id,
          canAccess: true,
        }
      );
    }
  }
}
