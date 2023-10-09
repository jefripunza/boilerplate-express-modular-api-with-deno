import mongoose, {
  Document,
  InferSchemaType,
  model as createModel,
  Schema,
} from "npm:mongoose@^6.7";
import { insertDocument } from "../../apps/mongoose.ts";
const Types = mongoose.Schema.Types;

export enum Permissions {
  viewUser = "VIEW_USER",
  updateUser = "UPDATE_USER",
  deleteUser = "DELETE_USER",

  createUserAddress = "CREATE_USER_ADDRESS",
  viewUserAddress = "VIEW_USER_ADDRESS",
  updateUserAddress = "UPDATE_USER_ADDRESS",
  deleteUserAddress = "DELETE_USER_ADDRESS",

  createNotification = "CREATE_NOTIFICATION",
  viewNotification = "VIEW_NOTIFICATION",
  updateNotification = "UPDATE_NOTIFICATION",
  deleteNotification = "DELETE_NOTIFICATION",

  createRolePermission = "CREATE_ROLE_PERMISSION",
  viewRolePermission = "VIEW_ROLE_PERMISSION",
  updateRolePermission = "UPDATE_ROLE_PERMISSION",
  deleteRolePermission = "DELETE_ROLE_PERMISSION",

  viewProduct = "VIEW_PRODUCT",
  updateProduct = "UPDATE_PRODUCT",
  deleteProduct = "DELETE_PRODUCT",

  viewSupplier = "VIEW_SUPPLIER",
  updateSupplier = "UPDATE_SUPPLIER",
  deleteSupplier = "DELETE_SUPPLIER",
}

const PermissionSchema = new Schema(
  {
    key: {
      type: Types.String,
      enum: Object.values(Permissions),
      unique: true,
      required: true,
    },
    description: { type: Types.String },
    group: { type: Types.String },
    parentGroup: { type: Types.String },
  },
  {
    timestamps: true,
    collection: "permissions",
  }
);

export type Permission = InferSchemaType<typeof PermissionSchema> & Document;
const PermissionModel = createModel<Permission>("Permission", PermissionSchema);
export default PermissionModel;

export async function up() {
  // clear all data...
  await PermissionModel.deleteMany({});

  const roles = Object.values(Permissions).map((key) => {
    const group = String(key)
      .replace("CREATE_", "")
      .replace("VIEW_", "")
      .replace("UPDATE_", "")
      .replace("DELETE_", "");
    return {
      key,
      group,
    };
  });

  for (const role of roles) {
    await insertDocument(
      PermissionModel,
      {
        key: role.key,
      },
      role
    );
  }
}
