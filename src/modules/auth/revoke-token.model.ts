import mongoose, {
  Document,
  InferSchemaType,
  model,
  Schema,
} from "npm:mongoose@^6.7";
const Types = mongoose.Schema.Types;

const RevokeTokenSchema = new Schema(
  {
    user: { type: Types.String, ref: "User", required: true },
    jwtid: { type: Types.String, required: true },
  },
  {
    timestamps: true,
    collection: "revokeTokens",
  }
);

export type RevokeToken = InferSchemaType<typeof RevokeTokenSchema> & Document;
const RevokeTokenModel = model<RevokeToken>("RevokeToken", RevokeTokenSchema);
export default RevokeTokenModel;
