import { expect } from 'qing-t';
import ErrorWithCode from './errorWithCode';

it('ErrorWithCode: customized code', () => {
  const err = new ErrorWithCode('hi', 123);
  expect(err.message).to.eq('hi');
  expect(err.code).to.eq(123);
});

it('ErrorWithCode: default code', () => {
  const err = new ErrorWithCode('hi');
  expect(err.message).to.eq('hi');
  expect(err.code).to.eq(10000);
});
