import * as mm from 'mingru-models';
import post from './post/post';
import user from './user/user';
import { cmt, reply } from './cmt/cmt';
import postCmt from './post/postCmt';
import userStats from './user/userStats';
import userPwd from './user/userPwd';
import userAuth from './user/userAuth';
import likes from './like/likeableTables';
import forumPost from './forum/forumPost';
import forum from './forum/forum';

const tables: mm.Table[] = [
  post,
  user,
  cmt,
  postCmt,
  reply,
  userStats,
  userPwd,
  userAuth,
  forum,
  forumPost,
  ...likes.values(),
];
export default tables;
