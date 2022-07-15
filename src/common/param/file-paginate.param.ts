import { ApiProperty } from "@nestjs/swagger";

export class FilePaginationParam {
  @ApiProperty({
    description: "limit per page [max 50]",
    type: Number,
    default: 10,
    required: false,
  })
  limit: number = 10;
  @ApiProperty({
    description: "page number [start with 1]",
    type: Number,
    default: 1,
    required: false,
  })
  page: number = 1;

  totalPage: number = 0;
  count: number = 0;

  constructor(page: number = 1, limit: number = 10) {
    this.page = page;
    this.limit = limit > 50 ? 50 : limit;
  }

  genTotalPage() {
    if (this.limit > 0) this.totalPage = Math.ceil(this.count / this.limit);
    else this.totalPage = this.count;
  }
}
