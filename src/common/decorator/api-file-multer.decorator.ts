import { applyDecorators, SetMetadata, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { CustomFileMulter } from "../classes/custom-file-multer";

export function ApiFileMulter() {
  return applyDecorators(
    UseInterceptors(
      CustomFileMulter.array(
        "files",
        parseInt(process.env.FILE_MAX, 10) || 10,
        {
          storage: CustomFileMulter.diskStorage,
          fileFilter: CustomFileMulter.fileFilter,
        }
      )
    ),
    ApiConsumes("multipart/form-data"),
    ApiBody({
      schema: {
        type: "object",
        properties: {
          files: {
            type: "array",
            items: {
              type: "string",
              format: "binary",
            },
          },
        },
      },
    })
  );
}
