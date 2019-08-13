import * as defs from 'defs';

export default class ErrorWithCode extends Error {
  code: number;
  message: string;

  constructor(message: string, code: number = defs.GenericError) {
    super(message);
    this.code = code;
    this.message = message;
  }
}
