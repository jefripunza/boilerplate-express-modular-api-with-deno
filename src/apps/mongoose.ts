import mongoose from "npm:mongoose@^6.7";

export const connectDatabase = async (url: string): Promise<void> => {
  try {
    await mongoose.connect(url);
    console.log("✅ MongoDB Database connected");
  } catch (error) {
    console.error("❌ Error connecting to database:", error);
    Deno.exit();
  }
};

export const insertDocument = async (
  Model: any,
  filter: object,
  document: object
) => {
  const isDocExist = await Model.findOne(filter);
  if (isDocExist) {
    return isDocExist;
  }
  return await Model.create(document);
};
