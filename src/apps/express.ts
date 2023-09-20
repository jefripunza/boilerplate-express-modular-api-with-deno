// @deno-types="npm:@types/express@4"
import express from "npm:express@4.18.2";

import { fileExists } from "../helpers/fs.ts";
import * as random from "../helpers/random.ts";

// Declare Module Middlewares...
import cookieParser from "npm:cookie-parser@1.4.6";
import cors from "npm:cors@2.8.5";
import helmet from "npm:helmet@7.0.0";
import morgan from "npm:morgan@1.10.0";
import fileUpload from "npm:express-fileupload@1.4.0";
import swaggerUi from "npm:swagger-ui-express@4.6.3";

const app = express();

//-> Identitas User Request
// need cookieParser middleware before we can do anything with cookies
app.use(cookieParser());
const key_identity = "identity";
app.use(function (req: any, res, next) {
  req.ip_address =
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress;
  // check if client sent cookie
  if (req.cookies[key_identity] === undefined) {
    // set a new cookie
    res.cookie(key_identity, random.Text(18), {
      httpOnly: true,
    });
  }
  next(); // <-- important!
});

//-> middlewares
// for security
app.disable("x-powered-by");
app.use(cors());
app.use(helmet());
// for data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// // management file upload
// app.use(
//   fileUpload({
//     limits: {
//       fileSize: FileUploader.max_file_upload_size * 1024 * 1024, // MB
//     },
//   })
// );

// logger
app.use(morgan("dev")); // skip swagger

for await (const dirEntry of Deno.readDir("src/modules")) {
  if (!dirEntry.name.startsWith("#") && dirEntry.isDirectory) {
    const name = dirEntry.name;
    const path_route_file = `src/modules/${name}/${name}.router.ts`;
    const is_router_exist = await fileExists(path_route_file);
    if (is_router_exist) {
      const routeModule = await import(`../modules/${name}/${name}.router.ts`);
      if (routeModule && routeModule.default) {
        app.use(routeModule.default);
        console.log(`Module "${name}" loaded!`);
      }
    }
  }
}

export { app };
