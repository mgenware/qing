export interface DiscussionWind {
  appDiscussionID: string;
  appDiscussionCmtCount: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (window as any) as DiscussionWind;
