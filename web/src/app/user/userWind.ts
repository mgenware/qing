export interface UserWind {
  appUserID: string;
  appUserName: string;
  appUserIconURL: string;
  appUserURL: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (window as any) as UserWind;