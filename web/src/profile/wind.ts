// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = window as any;
export class Wind {
  isPrevEnabled = w.appIsPrevEnabled as boolean;
  isNextEnabled = w.appIsNextEnabled as boolean;
}

export default new Wind();
