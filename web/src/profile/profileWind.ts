export interface ProfileWind {
  appProfileURL: string;
  appProfileUID: string;
  appProfileWebsite: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (window as any) as ProfileWind;
