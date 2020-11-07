export interface ThreadWind {
  appThreadID: string;
  appThreadCmtCount: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (window as any) as ThreadWind;
