import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { FilePaginationParam } from "../param/file-paginate.param";

@Injectable()
export class FilePaginationParamPipe implements PipeTransform<any, any> {
  transform(
    filePaginationParam: FilePaginationParam,
    metatype: ArgumentMetadata
  ): FilePaginationParam {
    let page = 1;
    let limit = 10;
    if (filePaginationParam.limit) {
      limit = parseInt(`${filePaginationParam.limit}`, 10) || limit;
    }
    if (filePaginationParam.page) {
      page = parseInt(`${filePaginationParam.page}`, 10) || page;
    }
    const newFilePaginationParam = new FilePaginationParam(page, limit);
    return newFilePaginationParam;
  }
}
