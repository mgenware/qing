/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

// https://stackoverflow.com/a/59104900/17227535
// eslint-disable-next-line @typescript-eslint/ban-types
const debounce = <T extends Function>(n: number, fn: T, immed = false) => {
  let timer: number | undefined;
  // eslint-disable-next-line func-names
  return function (this: unknown, ...args: unknown[]) {
    if (timer === undefined && immed) {
      fn.apply(this, args);
    }
    clearTimeout(timer);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    timer = window.setTimeout(() => fn.apply(this, args), n);
  };
};

export default debounce;
