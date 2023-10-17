import {
  opine,
  json,
  urlencoded,
  serveStatic,
} from "https://deno.land/x/opine@2.3.4/mod.ts";
import { Status } from "https://deno.land/x/opine@2.3.4/deps.ts";

// Declare Module Middlewares...
import cookieParser from "npm:cookie-parser@1.4.6";
import cors from "npm:cors@2.8.5";
import helmet from "npm:helmet@7.0.0";
import morgan from "npm:morgan@1.10.0";

import * as random from "../helpers/random.ts";
import { Server } from "../env.ts";
import { public_dir } from "../path.ts";
import * as Swagger from "../swagger.ts";

import routeModule from "../modules/index.ts";

const app = opine();

// swagger first...
if (Server.isDevelopment) {
  await Swagger.route(app);
}

//-> Identitas User Request
// need cookieParser middleware before we can do anything with cookies
app.use(cookieParser());
const key_identity = "identity";
app.use(function (req: any, res, next) {
  res.locals.ip_address =
    req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for");
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
app.use(json());
app.use(urlencoded({ extended: false }));

// static file
app.use(
  "/assets",
  serveStatic(public_dir, {
    etag: false,
  })
);

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

// import all modules
app.use(routeModule);

// 404 : Endpoint Not Found !!!
app.all("*", (req, res) => {
  if (
    !["get", "post", "put", "patch", "delete"].includes(
      String(req.method).toLowerCase()
    )
  ) {
    return res.setStatus(Status.Forbidden).send("forbidden");
  }
  return res.setStatus(Status.NotFound).json({
    message: "endpoint not found!",
  });
});

export { app };
