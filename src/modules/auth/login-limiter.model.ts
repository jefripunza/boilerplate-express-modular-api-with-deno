import mongoose, {
  Document,
  InferSchemaType,
  model,
  Schema,
} from "npm:mongoose@^6.7";
const Types = mongoose.Schema.Types;

const LoginLimiterSchema = new Schema(
  {
    user: { type: Types.String, ref: "User", required: true },
    createdAt: {
      type: Types.Date,
      expires: "10m",
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "loginLimiters",
  }
);

export type LoginLimiter = InferSchemaType<typeof LoginLimiterSchema> &
  Document;
const LoginLimiterModel = model<LoginLimiter>(
  "LoginLimiter",
  LoginLimiterSchema
);
export default LoginLimiterModel;
