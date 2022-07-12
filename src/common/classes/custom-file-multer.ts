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
      const temp: string = `${process.env.TEMP_FOLDER}` || "upload/temp";
      if (!file) {
        callback(new Error("Uploading file failed"), null);
      }
      console.log("🚗", file);

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
      console.log(`${Date.now()}${extname(file.originalname)}`);
      callback(null, `${Date.now()}${extname(file.originalname)}`);
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
