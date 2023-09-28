import mongoose, {
  Document,
  InferSchemaType,
  model as createModel,
  Schema,
} from "npm:mongoose@^6.7";
import { insertDocument } from "../../apps/mongoose.ts";

export enum Permissions {
  viewUser = "VIEW_USER",
  updateUser = "UPDATE_USER",
  deleteUser = "DELETE_USER",

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
      type: mongoose.Schema.Types.String,
      enum: Object.values(Permissions),
      unique: true,
      required: true,
    },
    description: { type: mongoose.Schema.Types.String },
    group: { type: mongoose.Schema.Types.String },
    parentGroup: { type: mongoose.Schema.Types.String },
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
