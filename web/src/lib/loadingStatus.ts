/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import ErrorWithCode from './errorWithCode.js';

// Represents different states of a loading action.
export default class LoadingStatus {
  static __notStarted = new LoadingStatus();

  #error: ErrorWithCode | null = null;
  #isStarted = false;
  #isCompleted = false;

  get error(): ErrorWithCode | null {
    return this.#error;
  }

  get isStarted(): boolean {
    return this.#isStarted;
  }

  get isCompleted(): boolean {
    return this.#isCompleted;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static error(err: ErrorWithCode): LoadingStatus {
    const s = new LoadingStatus();
    s.#isStarted = true;
    s.#isCompleted = true;
    s.#error = err;
    return s;
  }

  static get working(): LoadingStatus {
    const s = new LoadingStatus();
    s.#isStarted = true;
    return s;
  }

  static get success(): LoadingStatus {
    const s = new LoadingStatus();
    s.#isStarted = true;
    s.#isCompleted = true;
    return s;
  }

  static get notStarted(): LoadingStatus {
    return this.__notStarted;
  }

  get hasError(): boolean {
    return !!this.error;
  }

  get isWorking(): boolean {
    return this.isStarted && !this.isCompleted;
  }

  get isSuccess(): boolean {
    return this.isCompleted && this.error === null;
  }
}
