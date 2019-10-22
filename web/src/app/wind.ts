const w = window as any;
export class Wind {
  userID = w.appUserID as string;
  userName = w.appUserName as string;
  userIconURL = w.appUserIconURL as string;
  userURL = w.appUserURL as string;

  postID = w.appPostID as string;
  postUserID = w.appPostUserID as string;
  postCmtCount = w.appPostCmtCount as number;
}

export default new Wind();
