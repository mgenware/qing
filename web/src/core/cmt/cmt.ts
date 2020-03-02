export default interface Cmt {
  id: string;
  title: string;
  createdAt: string;
  modifiedAt: string;
  replyCount: number;
  content: string;
  userID: string;
  userName: string;
  userURL: string;
  userIconURL: string;
}
