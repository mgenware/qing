export interface PostWind {
  appPostID: string;
  appPostCmtCount: number;
  appPostInitialLikes: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (window as any) as PostWind;
