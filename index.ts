import { Mongo, Server } from "./src/env.ts";
import { app } from "./src/apps/express.ts";
import { connectDatabase } from "./src/apps/mongoose.ts";

await connectDatabase(Mongo.url);
app.listen(
  Server.PORT,
  () => console.log(`✅ Listen at http://localhost:${Server.PORT}/swagger ...`),
);
