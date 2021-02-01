import { expect } from 'qing-t';
import ErrorWithCode from './errorWithCode';
import LoadingStatus from './loadingStatus';

it('error', () => {
  const err = new ErrorWithCode('a');
  const s = LoadingStatus.error(err);
  expect(s.error).to.eq(err);
  expect(s.isStarted).to.eq(true);
  expect(s.isCompleted).to.eq(true);
  expect(s.isWorking).to.eq(false);
  expect(s.isSuccess).to.eq(false);
});

it('success', () => {
  const s = LoadingStatus.success;
  expect(s.error).to.eq(null);
  expect(s.isStarted).to.eq(true);
  expect(s.isCompleted).to.eq(true);
  expect(s.isWorking).to.eq(false);
  expect(s.isSuccess).to.eq(true);
});

it('notStarted', () => {
  const s = LoadingStatus.notStarted;
  expect(s.error).to.eq(null);
  expect(s.isStarted).to.eq(false);
  expect(s.isCompleted).to.eq(false);
  expect(s.isWorking).to.eq(false);
  expect(s.isSuccess).to.eq(false);
});

it('working', () => {
  const s = LoadingStatus.working;
  expect(s.error).to.eq(null);
  expect(s.isStarted).to.eq(true);
  expect(s.isCompleted).to.eq(false);
  expect(s.isWorking).to.eq(true);
  expect(s.isSuccess).to.eq(false);
});
