export interface ProfileWind {
  appIsPrevEnabled: boolean;
  appIsNextEnabled: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (window as any) as ProfileWind;
