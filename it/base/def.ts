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

// View HTML and DB HTML are slightly different due to different encoding
// strategies in backend and frontend libraries.
function makeViewHTML(content: string) {
  // Content HTML has an extra <p> added by editor.
  return `<p>&lt;p&gt;${content}&lt;/p&gt;&lt;script&gt;alert('-39')&lt;/script&gt;</p>`;
}

function makeDBHTML(content: string) {
  // Content HTML has an extra <p> added by editor.
  return `<p>&lt;p&gt;${content}&lt;/p&gt;&lt;script&gt;alert(&#39;-39&#39;)&lt;/script&gt;</p>`;
}

// `sd` sample data.
export const sd = {
  timeString: '1/31/2019',
  title: makeText('title'),
  content: makeText('content'),
  contentViewHTML: makeViewHTML('content'),
  contentDBHTML: makeDBHTML('content'),
  updated: makeText('updated'),
  updatedViewHTML: makeViewHTML('updated'),
  updatedDBHTML: makeDBHTML('updated'),
  longText: '1'.repeat(200),
};

export const oldDate = new Date('2003-06-12');
