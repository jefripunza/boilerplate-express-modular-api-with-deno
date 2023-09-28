import mongoose, {
  Document,
  InferSchemaType,
  model,
  Schema,
} from "npm:mongoose@^6.7";

const RevokeTokenSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.String, ref: "User", required: true },
    jwtid: { type: mongoose.Schema.Types.String, required: true },
  },
  {
    timestamps: true,
    collection: "revokeTokens",
  }
);

export type RevokeToken = InferSchemaType<typeof RevokeTokenSchema> & Document;
export default model<RevokeToken>("RevokeToken", RevokeTokenSchema);
