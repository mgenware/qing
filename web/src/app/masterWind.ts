export interface MasterWind {
  appUserID: string;
  appUserURL: string;
  appUserName: string;
  appUserIconURL: string;
  appLang: string;
  appForumMod: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (window as any) as MasterWind;
