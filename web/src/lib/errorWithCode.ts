export const GENERIC_CODE = 1000;

export default class ErrorWithCode extends Error {
  code: number;
  message: string;

  constructor(message: string, code: number = GENERIC_CODE) {
    super(message);
    this.code = code;
    this.message = message;
  }
}
