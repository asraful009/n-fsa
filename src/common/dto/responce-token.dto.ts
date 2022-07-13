import { TokenDto } from "./token.dto";

export class ResponceTokenDto extends TokenDto {
  fileName: string;
  constructor(
    privateToken: string = "",
    publicToken: string = "",
    fileName: string = ""
  ) {
    super(privateToken, publicToken);
    this.fileName = fileName;
  }
}
