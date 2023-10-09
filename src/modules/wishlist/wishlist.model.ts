import mongoose, {
  Document,
  InferSchemaType,
  model,
  Schema,
} from "npm:mongoose@^6.7";
const Types = mongoose.Schema.Types;

const WishlistSchema = new Schema(
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
  },
  {
    timestamps: true,
    collection: "wishlists",
  }
);

export type Wishlist = InferSchemaType<typeof WishlistSchema> & Document;
const WishlistModel = model<Wishlist>("Wishlist", WishlistSchema);
export default WishlistModel;
