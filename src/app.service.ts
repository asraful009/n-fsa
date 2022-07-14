import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import keyGenerator from "./common/function/key-generator.function";
import { FileInfoIF } from "./common/interface/file-info.interface";
import { TokenDto } from "./common/dto/token.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FileEntity } from "./common/entity/file.entity";
import { Repository } from "typeorm";

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>
  ) {}

  save(files: Array<Express.Multer.File>, fileInfo: FileInfoIF): TokenDto[] {
    //console.log({ files, fileInfo });
    const fileEntity: FileEntity = new FileEntity();

    this.fileRepository.save(fileEntity);
    const tokens: TokenDto[] = [keyGenerator({ id: randomUUID(), file: {} })];
    return tokens;
  }
}
