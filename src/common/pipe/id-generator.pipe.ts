import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class IdGeneratorPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    throw new Error("Method not implemented.");
  }
}
