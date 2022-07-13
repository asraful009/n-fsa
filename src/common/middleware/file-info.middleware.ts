import { Injectable, NestMiddleware } from "@nestjs/common";
import { randomUUID } from "crypto";
import { NextFunction } from "express";
import { FileInfoIF } from "../interface/file-info.interface";

@Injectable()
export class FileInfoMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const fileInfo: FileInfoIF = {
      tempLocation: randomUUID(),
    };
    req["fileInfo"] = fileInfo;
    next();
  }
}
