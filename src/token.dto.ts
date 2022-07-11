export class Token {
  publicToken: string;
  privateToken: string;

  public constructor(privateToken: string = "", publicToken: string = "") {
    this.privateToken = privateToken;
    this.publicToken = publicToken;
  }
}
