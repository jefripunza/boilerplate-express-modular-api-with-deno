import mongoose, {
  Document,
  InferSchemaType,
  model,
  Schema,
} from "npm:mongoose@^6.7";
const Types = mongoose.Schema.Types;

const CartSchema = new Schema(
  {
    customer: {
      type: Types.String,
      ref: "User",
      required: true,
    },
    product: {
      type: Types.String,
      ref: "Product",
      required: true,
    },

    isSelect: { type: Types.Boolean, default: true },
    quantity: { type: Types.Number, default: 1 },
  },
  {
    timestamps: true,
    collection: "carts",
  }
);

export type Cart = InferSchemaType<typeof CartSchema> & Document;
const CartModel = model<Cart>("Cart", CartSchema);
export default CartModel;
