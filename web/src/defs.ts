export const GenericError = 10000;
export const NeedAuthError = 10001;
export const CaptchaNotFoundError = 10002;
export const CaptchaNotMatchError = 10003;
export const errLSDict = new Map<number, string>();
errLSDict.set(NeedAuthError, 'needAuthErr');
errLSDict.set(CaptchaNotFoundError, 'captNotFoundErr');
errLSDict.set(CaptchaNotMatchError, 'captNotMatch');

export class Cookies {
  // "Local" indicates that server is not aware of this cookie.
  static themeKey = 'local_user_theme';
}

export enum UserTheme {
  light = 0,
  dark,
}
