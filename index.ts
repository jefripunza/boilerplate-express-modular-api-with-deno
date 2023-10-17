import { app } from "./src/apps/opine.ts";
import { Mongo, Server } from "./src/env.ts";
import { connectDatabase } from "./src/apps/mongoose.ts";

await connectDatabase(Mongo.url);
console.log("✅ MongoDB Database connected");

app.listen(Server.PORT, () =>
  console.log(`✅ Listen at http://localhost:${Server.PORT}/swagger ...`)
);
