export default interface PCPost {
  id: string;
  url: string;
  title: string;
  cmtCount: number;
  likes: number;
  createdAt: string;
  modifiedAt: string;
  // Available in FPosts.
  msgCount: number;
}
