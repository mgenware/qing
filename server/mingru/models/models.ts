import * as mm from 'mingru-models';
import post from './post/post';
import user from './user/user';
import { cmt, reply } from './cmt/cmt';
import postCmt from './post/postCmt';
import userStats from './user/userStats';
import userPwd from './user/userPwd';
import userAuth from './user/userAuth';
import likes from './like/likeableTables';
import thread from './thread/thread';
import threadCmt from './thread/threadCmt';
import threadMsg from './thread/threadMsg';
import threadMsgCmt from './thread/threadMsgCmt';

const tables: mm.Table[] = [
  user,
  cmt,
  reply,
  post,
  postCmt,
  userStats,
  userPwd,
  userAuth,
  thread,
  threadCmt,
  threadMsg,
  threadMsgCmt,
  threadMsg,
  threadMsgCmt,
  ...likes.values(),
];
export default tables;
