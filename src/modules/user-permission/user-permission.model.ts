import mongoose, {
  Document,
  InferSchemaType,
  model as createModel,
  Schema,
} from "npm:mongoose@^6.7";

const UserPermissionSchema = new Schema(
  {
    role: {
      type: mongoose.Schema.Types.String,
      ref: "UserRole",
      required: true,
    },
    permission: {
      type: mongoose.Schema.Types.String,
      ref: "Permission",
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
