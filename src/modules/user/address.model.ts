import mongoose, {
  Document,
  InferSchemaType,
  model,
  Schema,
} from "npm:mongoose@^6.7";

const AddressSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: true,
    },

    full: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "address",
  }
);

export type Address = InferSchemaType<typeof AddressSchema> & Document;
const AddressModel = model<Address>("Address", AddressSchema);
export default AddressModel;
