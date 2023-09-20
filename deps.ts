import * as path from "https://deno.land/std@0.202.0/path/mod.ts";

// ================================================================ //

import axios from "npm:axios@1.4.0";

// @deno-types="npm:@types/cookie-parser@1.4.3"
import cookieParser from "npm:cookie-parser@1.4.6";

// @deno-types="npm:@types/cors@2.8.13"
import cors from "npm:cors@2.8.5";

// @deno-types="npm:@types/express@4"
import express from "npm:express@4.18.2";

// @deno-types="npm:@types/express-fileupload@1.4.1"
import expressFileupload from "npm:express-fileupload@1.4.0";

import helmet from "npm:helmet@7.0.0";

import httpStatusCode from "npm:http-status-codes@2.2.0";

// @deno-types="npm:@types/jsonwebtoken@9.0.0"
import jsonwebtoken from "npm:jsonwebtoken@9.0.2";

// @deno-types="npm:@types/knex@0.16.1"
import knex from "npm:knex@2.4.2";

// @deno-types="npm:@types/morgan@1.9.4"
import morgan from "npm:morgan@1.10.0";

import mysql2 from "npm:mysql2@3.3.1";

// @deno-types="npm:@types/node-cron@3.0.8"
import nodeCron from "npm:node-cron@3.0.2";

import swaggerAutogen from "npm:swagger-autogen@2.23.1";

// @deno-types="npm:@types/swagger-ui-express@4.1.3"
import swaggerUiExpress from "npm:swagger-ui-express@4.6.3";
