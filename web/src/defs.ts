export const GenericError = 10000;
export const NeedAuthError = 10001;
export const CaptchaNotFoundError = 10002;
export const CaptchaNotMatchError = 10003;
export const errLSDict = new Map<number, string>();
errLSDict.set(NeedAuthError, 'needAuthErr');
errLSDict.set(CaptchaNotFoundError, 'captNotFoundErr');
errLSDict.set(CaptchaNotMatchError, 'captNotMatch');
