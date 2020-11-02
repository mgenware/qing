export interface ThreadWind {
  appThreadID: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (window as any) as ThreadWind;
