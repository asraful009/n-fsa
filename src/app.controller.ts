import {
  Controller,
  Logger,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { randomUUID } from "crypto";
import { AppService } from "./app.service";
import { ApiFileMulter } from "./common/decorator/api-file-multer.decorator";
import keyGenerator from "./common/function/key-generator.function";
import { FileSizeValidationPipe } from "./common/pipe/file-size-validation.pipe";
import { Token } from "./token.dto";

@Controller("files")
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Post()
  @ApiFileMulter()
  upload(
    @UploadedFiles(FileSizeValidationPipe) files: Array<Express.Multer.File>
  ): Token {
    console.log(files);
    const token: Token = keyGenerator({ id: randomUUID(), file: {} });
    return token;
  }
}
