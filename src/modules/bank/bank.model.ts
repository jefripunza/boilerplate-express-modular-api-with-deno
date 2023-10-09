import mongoose, {
  Document,
  InferSchemaType,
  model,
  Schema,
} from "npm:mongoose@^6.7";
const Types = mongoose.Schema.Types;

const BankSchema = new Schema(
  {
    name: { type: Types.String, required: true },
    logo: { type: Types.String, required: true },
    onBehalfName: { type: Types.String, required: true },
    accountNumber: { type: Types.String, required: true },
    tutorial: { type: Types.String, required: true },

    isRecommended: { type: Types.Boolean, default: true },
    isUse: { type: Types.Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "banks",
  }
);

export type Bank = InferSchemaType<typeof BankSchema> & Document;
const BankModel = model<Bank>("Bank", BankSchema);
export default BankModel;
