export const GenericError = 10000;
export const NeedAuthError = 10001;
export const CaptchaNotFoundError = 10002;
export const CaptchaNotMatchError = 10003;

export const localizedErrDict = new Map<number, string>();
localizedErrDict.set(NeedAuthError, 'needAuthErr');
localizedErrDict.set(CaptchaNotFoundError, 'captNotFoundErr');
localizedErrDict.set(CaptchaNotMatchError, 'captNotMatch');

export class Cookies {
  // "Local" indicates that server is not aware of this cookie.
  static themeKey = 'local_user_theme';
}

export enum UserTheme {
  light = 0,
  dark,
}
