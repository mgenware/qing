/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

export class Completer<T> {
  public readonly promise: Promise<T>;

  public complete!: (value: PromiseLike<T> | T) => void;
  public reject!: (reason?: unknown) => void;

  public constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.complete = resolve;
      this.reject = reject;
    });
  }
}
