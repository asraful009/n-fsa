import { BadRequestException, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import keyGenerator from "./common/function/key-generator.function";
import { FileInfoIF } from "./common/interface/file-info.interface";
import { TokenDto } from "./common/dto/token.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FileEntity } from "./common/entity/file.entity";
import { Repository } from "typeorm";
import { extname } from "path";
import * as mime from "mime-types";
import * as fs from "fs";
import { FilePaginationParam } from "./common/param/file-paginate.param";

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>
  ) {}

  async save(
    files: Array<Express.Multer.File>,
    fileInfo: FileInfoIF
  ): Promise<[FileEntity[], number]> {
    //console.log({ files, fileInfo });

    const filesEntity: FileEntity[] = [];
    for (const file of files) {
      try {
        const fileEntity: FileEntity = new FileEntity();
        fileEntity.id = randomUUID();
        fileEntity.fileName = file.originalname;
        fileEntity.fileExtension = mime.lookup(file.originalname)
          ? mime.extension(mime.lookup(file.originalname))
          : extname(file.originalname).substring(1);
        fileEntity.fileMime = mime.lookup(file.originalname)
          ? mime.lookup(file.originalname)
          : "application/octet-stream";
        fileEntity.createdAt = new Date();
        const token = keyGenerator({
          id: fileEntity.id,
          file: {
            fileName: fileEntity.fileName,
            fileExtension: fileEntity.fileExtension,
            fileMime: fileEntity.fileMime,
          },
        });
        fileEntity.privateToken = token.privateToken;
        fileEntity.publicToken = token.publicToken;
        const newLocation = `${process.env.FOLDER}`;

        if (!fs.existsSync(newLocation)) {
          fs.mkdirSync(newLocation, { recursive: true });
        }
        fileEntity.fileLocation = `${newLocation}/${fileEntity.id}.${fileEntity.fileExtension}`;
        console.log(fileEntity, file.path, fileEntity.fileLocation);
        fs.copyFileSync(file.path, fileEntity.fileLocation);
        filesEntity.push(fileEntity);
      } catch (error) {
        console.log("🚒", error);
      }
    }
    let ret = [];
    try {
      ret = await this.fileRepository.save(filesEntity);
    } catch (error) {
      console.log("🏌", error);
    }
    try {
      fs.rmSync(`${process.env.TEMP_FOLDER}/${fileInfo.tempLocation}`, {
        recursive: true,
        force: true,
      });
    } catch (error) {
      console.log("🎹", error);
    }

    return [ret, ret.length];
  }

  async delete(privateToken: string): Promise<FileEntity> {
    try {
      const fileEntity = await this.fileRepository
        .createQueryBuilder("fileEntitry")
        .andWhere("fileEntitry.privateToken = :privateToken", { privateToken })
        .getOne();
      await this.fileRepository.softDelete(fileEntity.id);
      return fileEntity;
    } catch (error) {
      console.log(error);

      throw new BadRequestException(`private token is not available`);
    }
  }

  async pagination(
    filePaginationParam: FilePaginationParam
  ): Promise<[FileEntity[], number]> {
    const [fileEntities, count]: [FileEntity[], number] =
      await this.fileRepository.findAndCount();
    return [fileEntities, count];
  }

  async getFileInfoByPublicToken(publicToken: string): Promise<FileEntity> {
    const fileEntity: FileEntity = await this.fileRepository
      .createQueryBuilder("fileEntitry")
      .andWhere("fileEntitry.publicToken = :publicToken", { publicToken })
      .getOne();
    return fileEntity;
  }
}
