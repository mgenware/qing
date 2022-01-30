/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Cmt } from './cmt';

export interface CmtEditorProps {
  open: boolean;

  // If not null, we're editing a comment or reply.
  editing: Cmt | null;
  // The cmt the user is replying to.
  to: Cmt | null;
  done: (cmt: Cmt) => void;
}
