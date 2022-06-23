/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

export const serverURL = 'http://localhost:8000';

function makeText(content: string) {
  return `<p>${content}</p><script>alert('-39')</script>`;
}

function makeHTML(content: string) {
  // Content HTML has an extra <p> added by editor.
  return `<p>&lt;p&gt;${content}&lt;/p&gt;&lt;script&gt;alert(&#39;-39&#39;)&lt;/script&gt;</p>`;
}

// `sd` sample data.
export const sd = {
  timeString: '10/27/1990',
  title: makeText('title'),
  content: makeText('content'),
  contentHTML: makeHTML('content'),
  updated: makeText('updated'),
  updatedHTML: makeHTML('updated'),
};
