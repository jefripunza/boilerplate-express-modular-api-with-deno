// @deno-types="npm:@types/express@4"
import { NextFunction, Request, Response } from "npm:express@4.18.2";
import { StatusCodes } from "npm:http-status-codes@2.2.0";

export default (permissionName: string) =>
  async (req: any, res: Response, next: NextFunction) => {
    //
  };
