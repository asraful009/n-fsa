import { FilePaginationParam } from "../param/file-paginate.param";

export interface ResponceIF {
  status: number;
  nonce: string;
  timestamp: string;
  errorMsg: string;
  payload: { pagination: FilePaginationParam; data: any };
}
