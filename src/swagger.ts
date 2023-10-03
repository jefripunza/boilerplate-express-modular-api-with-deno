// @deno-types="npm:@types/express@4"
import { Application } from "npm:express@4.18.2";
import SwagInit from "npm:swagger-autogen@2.23.1";

import { Swagger } from "./env.ts";
import { modules_dir, swagger_json_file, app_file } from "./path.ts";

import { StatusCodes } from "npm:http-status-codes@2.2.0";

import {
  swagger_html,
  main_js,
  swagger_ui_bundle_js,
  swagger_ui_standalone_preset_js,
} from "./file_cache.ts";

import { swagger_json_cache } from "./swagger_json.ts";

const doc = {
  info: {
    title: Swagger.APP_NAME,
    version: Swagger.APP_VERSION,
    description: Swagger.APP_DESCRIPTION,
    termsOfService: "http://swagger.io/terms/",
    contact: {
      name: Swagger.CONTACT_NAME,
      email: Swagger.CONTACT_EMAIL,
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  host: Swagger.SWAGGER_URL,
  basePath: "/",
  schemes: Swagger.APP_SCHEMES,
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    // {
    //   name: "Auth",
    // },
  ],
  securityDefinitions: {
    Bearer: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description:
        "Enter your bearer token in the format **Bearer &lt;token>**",
    },
  },
  definitions: {
    only_message: {
      message: "string",
    },
  },
  components: {}, // by default: empty object (OpenAPI 3.x)
};

export const createSwaggerJson = async () => {
  const result: any = await SwagInit(
    swagger_json_file,
    [`${modules_dir}/index.ts`],
    doc
  );
  if (!result.success) {
    return false;
  }
  await Deno.remove(swagger_json_file, { recursive: true });
  return result.data;
};

export const route = async (app: Application) => {
  // TODO: bagaimana cara membuat swagger.json tanpa harus link url seperti ini, langsung dari variable
  let swagger_json = {};
  swagger_json = await createSwaggerJson();
  if (!swagger_json) {
    console.log("✅ Use Swagger on Cache!");
    swagger_json = swagger_json_cache;
  }
  app.get("/swagger.json", (_, res) => res.json(swagger_json));

  app.get("/swagger", (_, res) => res.send(swagger_html));
  app.get("/cache/:file", (req, res) => {
    const { file } = req.params;
    res.set("content-type", "text/javascript");
    if (file == "main.js") return res.send(main_js);
    if (file == "swagger-ui-bundle.js") return res.send(swagger_ui_bundle_js);
    if (file == "swagger-ui-standalone-preset.js")
      return res.send(swagger_ui_standalone_preset_js);
    return res.status(StatusCodes.NOT_FOUND).send("not found...");
  });
};
