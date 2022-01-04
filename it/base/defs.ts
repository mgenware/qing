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

// Return a set of sample data with the given content string.
function makeSD(content: string) {
  return {
    input: `<p>${content}</p><script>alert('-39')</script>`,
    san: `<p>${content}</p>`,
    inputHTML: `&lt;p&gt;${content}&lt;/p&gt;&lt;script&gt;alert('-39')&lt;/script&gt;`,
    sanHTML: `&lt;p&gt;${content}&lt;/p&gt;`,
  };
}

// `sd` sample data.
export const sd = {
  timeString: '10/27/1990',
  title: makeSD('title'),
  content: makeSD('content'),
  updated: makeSD('updated'),
};
