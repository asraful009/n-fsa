import {
  BadRequestException,
  Controller,
  Logger,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiFileMulter } from "./common/decorator/api-file-multer.decorator";
import { FileInfo } from "./common/decorator/file-info.decorator";
import { FileInfoIF } from "./common/interface/file-info.interface";
import { FileSizeValidationPipe } from "./common/pipe/file-size-validation.pipe";
import { TokenDto } from "./common/dto/token.dto";

@Controller("files")
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Post()
  @ApiFileMulter()
  upload(
    @UploadedFiles(FileSizeValidationPipe) files: Array<Express.Multer.File>,
    @FileInfo() fileInfo: FileInfoIF
  ): TokenDto[] {
    // throw new BadRequestException("asdasdas");
    const tokens: TokenDto[] = this.appService.save(files, fileInfo);
    return tokens;
  }
}
