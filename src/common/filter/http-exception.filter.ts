import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { randomBytes } from "crypto";
import { Request, Response } from "express";
import { ResponceIF } from "../dto/responce.dto";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;
    // console.log(exception.message);
    const res: ResponceIF = {
      status,
      nonce: randomBytes(128).toString("hex"),
      timestamp: new Date().toISOString(),
      errorMsg: message,
      payload: { pagination: null, data: null },
    };
    response.status(status).json(res);
  }
}
