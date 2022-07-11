import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(
    files: Express.Multer.File[],
    metadata: ArgumentMetadata
  ): Express.Multer.File[] {
    const size = parseInt(process.env.FILE_SIZE, 10) || 10240000; // 10MB
    if (files === undefined || files === null) {
      throw new BadRequestException("Validation failed (file expected)");
    }
    if (Array.isArray(files) && files.length === 0) {
      throw new BadRequestException("Validation failed (files expected)");
    }
    console.log(files.length);

    const newFilterFiles = files.filter((file) => file.size <= size);
    console.log(newFilterFiles.length);

    return newFilterFiles;
  }
}
