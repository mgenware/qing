import app from 'app';

const errMessage = 'Assertion failed';

export function CHECK(v: unknown) {
  if (v === undefined || v === null) {
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
