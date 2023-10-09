import mongoose, {
  Document,
  InferSchemaType,
  model,
  Schema,
} from "npm:mongoose@^6.7";
const Types = mongoose.Schema.Types;

export interface ProductImage {
  url: string;
  isFront: boolean;
  sortNumber: number;
}

const ProductSchema = new Schema(
  {
    // detail...
    name: { type: Types.String, required: true },
    url: { type: Types.String, required: true, unique: true },
    images: [
      {
        url: { type: Types.String },
        isFront: { type: Types.Boolean, default: false },
        sortNumber: { type: Types.Number, default: 0 },
      },
    ],
    description: { type: Types.String, required: true }, // html

    category: {
      type: Types.String,
      ref: "productCategory",
      required: true,
    },
    merchant: {
      type: Types.String,
      ref: "User",
      required: true,
    },

    // business...
    price: { type: Types.Number, default: 0 },
    discountPrice: { type: Types.Number, default: 0 },
    weightGram: { type: Types.Number, default: 0 },
    stock: { type: Types.Number, default: 0 },
    amountSold: { type: Types.Number, default: 0 },

    isHide: { type: Types.Boolean, default: false },
    deletedAt: { type: Types.Date, default: undefined },
  },
  {
    timestamps: true,
    collection: "products",
  }
);

export type Product = InferSchemaType<typeof ProductSchema> & Document;
const ProductModel = model<Product>("Product", ProductSchema);
export default ProductModel;
