import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
  MulterModule,
} from "@nestjs/platform-express";
import { Request } from "express";
import { diskStorage, StorageEngine } from "multer";
import * as fs from "fs";
import { extname } from "path";
import * as mime from "mime-types";
import { randomUUID } from "crypto";
import { FileInfoIF } from "../interface/file-info.interface";

export class CustomFileMulter {
  static typeModule = MulterModule;
  static register = MulterModule.register;
  static fields = FileFieldsInterceptor;
  static array = FilesInterceptor;
  static single = FileInterceptor;

  static diskStorage: StorageEngine = diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      callback: Function
    ) => {
      const fileInfo: FileInfoIF = req["fileInfo"];
      const temp: string =
        `${process.env.TEMP_FOLDER || "upload/temp"}/` + fileInfo.tempLocation;
      if (!file) {
        callback(new Error("Uploading file failed"), null);
      }
      if (!fs.existsSync(temp)) {
        try {
          fs.mkdirSync(temp, { recursive: true });
        } catch (error) {
          callback(new Error(`Can not create ${temp} directory`).message, null);
        }
      }
      callback(null, temp);
    },
    filename: (req: Request, file: Express.Multer.File, callback: Function) => {
      const fileName: string = `${randomUUID()}${extname(file.originalname)}`;
      console.log(fileName);
      callback(null, fileName);
    },
  });

  static fileFilter(
    req: Request,
    file: Express.Multer.File,
    callback: Function
  ) {
    // console.log(
    //   mime.lookup(file.originalname),
    //   mime.extension(mime.lookup(file.originalname))
    // );
    // const fileName: string = `${Date.now()}.${mime.extension(
    //   mime.lookup(file.originalname)
    // )}`;
    // return callback(null, false, new Error("goes wrong on the mimetype"));

    callback(null, file.originalname);
  }
}
