/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Cmt } from './cmt';

const eventPrefix = 'open-cmt-editor-';
let sessionCounter = 1;

export function newSessionID() {
  return `${sessionCounter++}`;
}

export function openEditorResultEvent(session: string) {
  return `${eventPrefix}-response-${session}`;
}

export interface CmtEditorProps {
  // If not null, we're editing a comment or reply.
  editing: Cmt | null;
  // The cmt the user is replying to.
  to: Cmt | null;
  // A non-null value forces the editor to open.
  // Call `newSessionID` to grab a session value.
  editorSession: string | null;
}
