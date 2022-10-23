// /*
//  * Copyright (C) 2022 The Qing Project. All rights reserved.
//  *
//  * Use of this source code is governed by a license that can
//  * be found in the LICENSE file.
//  */

// import { CmtFixtureWrapper } from './common';
// import { usr } from 'br';
// import * as def from 'base/def';
// import * as cm from './common';
// import { writeCmt, editCmt } from './actions';
// import * as cps from 'br/com/editing/composer';
// import delay from 'base/delay';
// import { newUser } from 'helper/user';
// import * as act from './actions';

// export default async function testReplyNoti(w: CmtFixtureWrapper) {
//   await newUser(async (u) => {
//     // Noti for root cmts are tested in individual post types.
//     w.test('Send a noti when replying to another cmt', u, async ({ p }) => {
//       {
//         {
//           // tmp user: creates a cmt.
//           const cmtApp = await w.getCmtApp(p);
//           await writeCmt(p, { cmtApp, content: def.sd.content });
//         }
//         {
//           // user1: replies to it.
//           await p.reload(usr.user);
//           const cmtApp = await w.getCmtApp(p);

//           const cmtEl = cm.getTopCmt({ cmtApp });
//           await act.writeReply(p, { cmtEl, content: '123' });
//         }
//       }
//     });
//   });
// }
