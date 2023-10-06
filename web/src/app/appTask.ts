/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader.js';
import LoadingStatus from 'lib/loadingStatus.js';
import Result from 'lib/result.js';
import ErrorWithCode from 'lib/errorWithCode.js';
import appAlert from './appAlert.js';
import appSpinner from './appSpinner.js';

// Helper class for executing tasks (loaders).
export class AppTask {
  // Starts a loader and calls the given callback when status changes.
  async local<T>(loader: Loader<T>, cb: (status: LoadingStatus) => void): Promise<Result<T>> {
    try {
      // eslint-disable-next-line no-param-reassign
      loader.loadingStatusChanged = cb;
      const data = await loader.startAsync();
      return Result.data(data);
    } catch (err) {
      ErrorWithCode.assert(err);
      // Note: error is also handled in loader.loadingStatusChanged.
      return Result.error<T>(err);
    }
  }

  // Starts a loader and displays a global loading overlay.
  async critical<T>(
    loader: Loader<T>,
    overlayText?: string,
    cb?: (status: LoadingStatus) => void,
  ): Promise<Result<T>> {
    try {
      // eslint-disable-next-line no-param-reassign
      loader.loadingStatusChanged = (s) => {
        if (cb) {
          cb(s);
        }
      };
      appSpinner.showLoadingOverlay(overlayText || globalThis.coreLS.loading);
      const data = await loader.startAsync();
      appSpinner.hideLoadingOverlay();
      return Result.data(data);
    } catch (err) {
      ErrorWithCode.assert(err);
      appSpinner.hideLoadingOverlay();
      await appAlert.error(err.message);
      return Result.error<T>(err);
    }
  }
}

const appTask = new AppTask();
export default appTask;
