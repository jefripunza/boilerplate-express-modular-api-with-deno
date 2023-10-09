import mongoose, {
  Document,
  InferSchemaType,
  model,
  Schema,
} from "npm:mongoose@^6.7";
const Types = mongoose.Schema.Types;

const ProductCategorySchema = new Schema(
  {
    name: { type: Types.String, required: true },
    logo: { type: Types.String },

    isHide: { type: Types.Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "productCategories",
  }
);

export type ProductCategory = InferSchemaType<typeof ProductCategorySchema> &
  Document;
const ProductCategoryModel = model<ProductCategory>(
  "productCategory",
  ProductCategorySchema
);
export default ProductCategoryModel;
