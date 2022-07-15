import {
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UploadedFiles,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiFileMulter } from "./common/decorator/api-file-multer.decorator";
import { FileInfo } from "./common/decorator/file-info.decorator";
import { FileInfoIF } from "./common/interface/file-info.interface";
import { FileSizeValidationPipe } from "./common/pipe/file-size-validation.pipe";
import { FilePaginationParam } from "./common/param/file-paginate.param";
import { FilePaginationParamPipe } from "./common/pipe/file-pagination.pipe";

@Controller("files")
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Post()
  @ApiFileMulter()
  async upload(
    @UploadedFiles(FileSizeValidationPipe) files: Array<Express.Multer.File>,
    @FileInfo() fileInfo: FileInfoIF
  ): Promise<any> {
    const [filesEntities, count] = await this.appService.save(files, fileInfo);
    const filePaginationParam: FilePaginationParam = new FilePaginationParam(
      1,
      0
    );
    filePaginationParam.count = count;
    filePaginationParam.genTotalPage();
    const retObj: any[] = [];
    for (const file of filesEntities) {
      const fileRet = {
        id: file.id,
        fileName: file.fileName,
        fileE: file.fileExtension,
        fileMime: file.fileMime,
        privateToken: file.privateToken,
        publicToken: file.publicToken,
      };
      retObj.push(fileRet);
    }
    filePaginationParam.count = count;
    filePaginationParam.genTotalPage();
    const data = [filePaginationParam, retObj];
    return data;
  }

  @Get("list")
  async list(
    @Query(FilePaginationParamPipe)
    filePaginationParam: FilePaginationParam
  ): Promise<any> {
    console.log(filePaginationParam);
    const [filesEntities, count] = await this.appService.pagination(
      filePaginationParam
    );
    console.log(filesEntities);
    const retObj: any[] = [];
    for (const file of filesEntities) {
      const fileRet = {
        id: file.id,
        fileName: file.fileName,
        fileE: file.fileExtension,
        fileMime: file.fileMime,
        privateToken: file.privateToken,
        publicToken: file.publicToken,
      };
      retObj.push(fileRet);
    }
    filePaginationParam.count = count;
    filePaginationParam.genTotalPage();
    const data = [filePaginationParam, retObj];
    return data;
  }

  @Get(":token")
  async get(@Param() token: string): Promise<any> {
    return;
  }

  @Delete(":token")
  async delete(@Param() token: string): Promise<any> {
    return;
  }
}
