// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = window as any;
export class Wind {
  userID = w.appUserID as string;
  userName = w.appUserName as string;
  userIconURL = w.appUserIconURL as string;
  userURL = w.appUserURL as string;

  postID = w.appPostID as string;
  postCmtCount = w.appPostCmtCount as number;
  appPostInitialLikes = w.appPostInitialLikes as number;
}

export default new Wind();
