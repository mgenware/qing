/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

export const entity = {
  post: 1,
  cmt: 2,
  reply: 3,
  discussion: 4,
  question: 5,
  discussionMsg: 6,
  answer: 7,
  forumDiscussion: 8,
  forumQuestion: 9,
  forum: 10,
  forumGroup: 11,
};

export const sd = {
  timeString: '1990-10-27T10:11:12Z',
  updatedContentRaw: "<p>_MOD_</p><script>alert('-39')</script>",
  updatedContentSan: '<p>_MOD_</p>',
  updatedContentSanHTML: '&lt;p&gt;_MOD_&lt;/p&gt;',
  updatedContentRawHTML: "&lt;p&gt;_MOD_&lt;/p&gt;&lt;script&gt;alert('-39')&lt;/script&gt;",
  postContentRaw: "<p>post_c</p><script>alert('-39')</script>",
  postContentSan: '<p>post_c</p>',
  postTitleRaw: "<p>post_t</p><script>alert('-39')</script>",
};
