import app from 'app';

const errMessage = 'Assertion failed';

export function CHECK(v: unknown): asserts v {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!v) {
    if (app.devMode) {
      throw new Error(errMessage);
    } else {
      // eslint-disable-next-line no-console
      console.error(errMessage);
      // eslint-disable-next-line no-console
      console.trace();
    }
  }
}
