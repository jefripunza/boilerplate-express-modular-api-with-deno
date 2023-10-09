import mongoose, {
  Document,
  InferSchemaType,
  model,
  Schema,
} from "npm:mongoose@^6.7";
const Types = mongoose.Schema.Types;

const UserAddressSchema = new Schema(
  {
    user: {
      type: Types.String,
      ref: "User",
      required: true,
    },

    title: {
      type: Types.String,
      required: true,
    },
    full: {
      type: Types.String,
      required: true,
    },
    coordinate: [
      {
        type: Types.String,
        required: true,
      },
    ],
    postcode: {
      type: Types.String,
      required: true,
    },
    rajaongkirCode: {
      type: Types.String,
      required: true,
    },

    isDefault: {
      type: Types.Boolean,
      default: false,
    },

    deletedAt: { type: Types.Date, default: undefined },
  },
  {
    timestamps: true,
    collection: "userAddress",
  }
);

export type UserAddress = InferSchemaType<typeof UserAddressSchema> & Document;
const UserAddressModel = model<UserAddress>("UserAddress", UserAddressSchema);
export default UserAddressModel;
