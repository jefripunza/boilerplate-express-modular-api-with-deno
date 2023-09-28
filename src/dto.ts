import { StatusCodes } from "npm:http-status-codes@2.2.0";

interface IData {
  [key: string]: any;
}

interface IPagination {
  current_page: number;
  per_page: number;
  from: number;
  to: number;
  total: number;
  last_page: number;
}

interface ISuccess {
  message: string;
  statusCode: number;
  success: boolean;
  data: IData[] | IData;
  meta: {
    pagination: IPagination;
  };
}
interface ISuccessResponse {
  message?: string;
  statusCode?: number;
  success?: boolean;
  data?: IData[] | IData;
  meta?: {
    pagination: IPagination;
  };
}
export const successResponse = (response: ISuccessResponse): ISuccess => {
  const new_response: any = { ...response };
  if (typeof new_response?.message == "undefined") {
    new_response.message = "OK";
  }
  if (typeof new_response?.statusCode == "undefined") {
    new_response.statusCode = StatusCodes.OK;
  }
  if (typeof new_response?.success == "undefined") {
    new_response.success = true;
  }
  if (typeof new_response?.data == "undefined") {
    new_response.data = [];
  }
  return new_response;
};

interface IError {
  message: string;
  statusCode: number;
  success: boolean;
  data: IData[] | IData;
}
interface IErrorResponse {
  message?: string;
  statusCode?: number;
  success?: boolean;
  data?: IData[] | IData;
}
export const errorResponse = (response: IErrorResponse): IError => {
  const new_response: any = { ...response };
  if (typeof new_response?.message == "undefined") {
    new_response.message = "ERROR";
  }
  if (typeof new_response?.statusCode == "undefined") {
    new_response.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (typeof new_response?.success == "undefined") {
    new_response.success = false;
  }
  return new_response;
};

// ------------------------------------------------------------------- //
//-> Custom Response

export const notFoundResponse = (message = "Not Found") => {
  return errorResponse({ message, statusCode: StatusCodes.NOT_FOUND });
};
export const notAuthorizedResponse = (message = "Not Authorized") => {
  return errorResponse({ message, statusCode: StatusCodes.UNAUTHORIZED });
};

export const internalServerErrorResponse = (from: string, error: Error) => {
  console.error(`${from} : ${error.message}\n${error.stack}`);
  return errorResponse({
    message: "internal server error",
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  });
};
