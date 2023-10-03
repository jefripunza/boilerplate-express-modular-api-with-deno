import mongoose, {
  Document,
  InferSchemaType,
  model,
  Schema,
} from "npm:mongoose@^6.7";

const UserAddressSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: true,
    },

    title: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    full: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    coordinate: [
      {
        type: mongoose.Schema.Types.String,
        required: true,
      },
    ],
    postcode: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    rajaongkir_code: {
      type: mongoose.Schema.Types.String,
      required: true,
    },

    isDefault: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
    },

    deletedAt: { type: mongoose.Schema.Types.Date, default: undefined },
  },
  {
    timestamps: true,
    collection: "userAddress",
  }
);

export type UserAddress = InferSchemaType<typeof UserAddressSchema> & Document;
const UserAddressModel = model<UserAddress>("UserAddress", UserAddressSchema);
export default UserAddressModel;
