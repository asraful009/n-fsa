import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { diskStorage } from "multer";
import { extname } from "path";

export function ApiFile() {
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor("files", parseInt(process.env.FILE_MAX, 10) || 10, {
        {storage: storage}
      })
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

export const storage = diskStorage({
  destination: process.env.FOLDER,
  filename: (req, file, callback) => {
    callback(null, generateFilename(file));
  },
});

function generateFilename(file) {
  return `${Date.now()}.${extname(file.originalname)}`;
}
