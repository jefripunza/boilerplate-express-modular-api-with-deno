import { Mongo } from "../env.ts";
import { connectDatabase } from "../apps/mongoose.ts";

await connectDatabase(Mongo.url);

import * as Permission from "../modules/permission/permission.model.ts";
import * as UserRole from "../modules/user/user-role.model.ts";
import * as UserPermission from "../modules/user/user-permission.model.ts";

import * as User from "../modules/user/user.model.ts";

// execute...
await Permission.up();
await UserRole.up();
await UserPermission.up();

await User.up();

Deno.exit();
