import * as mm from 'mingru-models';
import post from './models/post';
import user from './models/user';
import { cmt, reply } from './models/cmt';
import postCmt from './models/postCmt';
import userStats from './models/userStats';
import userPwd from './models/userPwd';
import userAuth from './models/userAuth';
import likes from './models/likes';

const tables: mm.Table[] = [
  post,
  user,
  cmt,
  postCmt,
  reply,
  userStats,
  userPwd,
  userAuth,
  ...likes.values(),
];
export default tables;
