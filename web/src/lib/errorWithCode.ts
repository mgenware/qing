import * as sc from 'sharedConstants';

export default class ErrorWithCode extends Error {
  code: number;
  message: string;

  constructor(message: string, code: number = sc.errGeneric) {
    super(message);
    this.code = code;
    this.message = message;
  }
}
