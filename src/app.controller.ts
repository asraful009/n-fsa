import {
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Response,
  StreamableFile,
  UploadedFiles,
} from "@nestjs/common";
import { createReadStream } from "fs";
import { AppService } from "./app.service";
import { ApiFileMulter } from "./common/decorator/api-file-multer.decorator";
import { FileInfo } from "./common/decorator/file-info.decorator";
import { FileInfoIF } from "./common/interface/file-info.interface";
import { FileSizeValidationPipe } from "./common/pipe/file-size-validation.pipe";
import { FilePaginationParam } from "./common/param/file-paginate.param";
import { FilePaginationParamPipe } from "./common/pipe/file-pagination.pipe";
import { join } from "path";

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
        fileExtension: file.fileExtension,
        fileMime: file.fileMime,
        privateToken: file.privateToken,
        publicToken: file.publicToken,
      };
      retObj.push(fileRet);
    }
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
        fileExtension: file.fileExtension,
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
  getFile(
    @Param("token") token: string,
    @Response({ passthrough: true }) res
  ): Promise<StreamableFile> {
    return new Promise((resolve, reject) => {
      this.appService
        .getFileInfoByPublicToken(token)
        .then((fileEntity) => {
          const file = createReadStream(fileEntity.fileLocation);
          res.set({
            "Content-Type": fileEntity.fileMime,
            "Content-Disposition": `attachment; filename="${fileEntity.fileName}"`,
          });
          resolve(new StreamableFile(file));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  @Delete(":token")
  async delete(@Param("token") token: string): Promise<any> {
    const filesEntity = [await this.appService.delete(token)];
    const filePaginationParam: FilePaginationParam = new FilePaginationParam(
      1,
      0
    );
    filePaginationParam.count = 1;
    filePaginationParam.genTotalPage();
    const retObj: any[] = [];
    for (const file of filesEntity) {
      const fileRet = {
        id: file.id,
        fileName: file.fileName,
        fileExtension: file.fileExtension,
        fileMime: file.fileMime,
        privateToken: file.privateToken,
        publicToken: file.publicToken,
      };
      retObj.push(fileRet);
    }
    const data = [filePaginationParam, retObj];
    return data;
  }
}
