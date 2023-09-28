// @deno-types="npm:@types/express@4"
import { Application } from "npm:express@4.18.2";
import SwagInit from "npm:swagger-autogen@2.23.1";

import { Server, Swagger } from "./env.ts";
import { modules_dir, swagger_html_file, swagger_json_file } from "./path.ts";

// import SwaggerUI from "npm:swagger-ui@5.7.2";
// const swagger = SwaggerUI({
//   url: "/swagger.json",
//   dom_id: "#swagger-ui",
// });
// console.log({ swagger });

// import { SwaggerUIBundle } from "npm:swagger-ui-dist@5.7.2";
// var SwaggerUIBundle = require('swagger-ui-dist').SwaggerUIBundle
// const ui = SwaggerUIBundle({
//   url: "/swagger.json",
//   dom_id: "#swagger-ui",
//   presets: [
//     SwaggerUIBundle.presets.apis,
//     SwaggerUIBundle.SwaggerUIStandalonePreset,
//   ],
//   layout: "StandaloneLayout",
// });

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
  host: `localhost:${Server.PORT}`,
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

export const route = async (app: Application) => {
  const endpointsFiles = [...Deno.readDirSync(modules_dir)]
    .filter((dirEntry) => !dirEntry.name.startsWith("#") && !dirEntry.isFile)
    .map(
      (dirEntry) =>
        `${modules_dir}/${dirEntry.name}/${dirEntry.name}.router.ts`,
    )
    .filter((dir_path) => {
      try {
        return Deno.statSync(dir_path).isFile;
      } catch (error) {
        return false;
      }
    });
  await SwagInit(swagger_json_file, endpointsFiles, doc);
  const swagger_text = await Deno.readTextFile(swagger_json_file);
  const swagger_json = JSON.parse(swagger_text);
  app.get("/swagger.json", (_, res) => res.json(swagger_json));
  await Deno.remove(swagger_json_file, { recursive: true });

  const swagger_html = await Deno.readTextFile(swagger_html_file);
  app.get("/swagger", (_, res) => res.send(swagger_html));
};
