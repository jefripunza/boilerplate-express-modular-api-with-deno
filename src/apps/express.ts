// @deno-types="npm:@types/express@4"
import express, { Request, Response } from "npm:express@4.18.2";
// import { opine } from "https://deno.land/x/opine@2.3.4/mod.ts";

// Declare Module Middlewares...
import cookieParser from "npm:cookie-parser@1.4.6";
import cors from "npm:cors@2.8.5";
import helmet from "npm:helmet@7.0.0";
import morgan from "npm:morgan@1.10.0";
import fileUpload from "npm:express-fileupload@1.4.0";
import SwagInit from "npm:swagger-autogen@2.23.1";

import { fileExist } from "../helpers/fs.ts";
import * as random from "../helpers/random.ts";
import { Server } from "../env.ts";
import {
  modules_dir,
  public_dir,
  swagger_html_file,
  swagger_json_file,
} from "../path.ts";
import * as Swagger from "../swagger.ts";

import routeModule from "../modules/index.ts";

const app = express();

// swagger first...
if (Server.isDevelopment) {
  await Swagger.route(app);
}

//-> Identitas User Request
// need cookieParser middleware before we can do anything with cookies
app.use(cookieParser());
const key_identity = "identity";
app.use(function (req: any, res, next) {
  req.ip_address = req.headers["x-real-ip"] ||
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

// static file
app.use(
  "/assets",
  express.static(public_dir, {
    etag: false,
  }),
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
      String(req.method).toLowerCase(),
    )
  ) {
    return res.status(403).send("forbidden");
  }
  return res.status(404).json({
    message: "endpoint not found!",
  });
});

export { app };
