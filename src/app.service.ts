import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import keyGenerator from "./common/function/key-generator.function";
import { FileInfoIF } from "./common/interface/file-info.interface";
import { TokenDto } from "./common/dto/token.dto";

@Injectable()
export class AppService {
  save(files: Array<Express.Multer.File>, fileInfo: FileInfoIF): TokenDto[] {
    //console.log({ files, fileInfo });
    const tokens: TokenDto[] = [keyGenerator({ id: randomUUID(), file: {} })];
    return tokens;
  }
}
