import Loader from 'lib/loader';
import LoadingStatus from 'lib/loadingStatus';
import Result from 'lib/result';
import ls from 'ls';
import ErrorWithCode from 'lib/errorWithCode';
import appAlert from './appAlert';

export class AppTask {
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
      appAlert.showLoadingOverlay(overlayText || ls.loading);
      const data = await loader.startAsync();
      appAlert.hideLoadingOverlay();
      return Result.data(data);
    } catch (err) {
      ErrorWithCode.assert(err);
      appAlert.hideLoadingOverlay();
      await appAlert.error(err.message);
      return Result.error<T>(err);
    }
  }
}

const appTask = new AppTask();
export default appTask;
