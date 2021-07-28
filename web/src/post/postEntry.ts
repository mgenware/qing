/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { hookUpEditBarEvents } from 'com/postCore/postCoreLib';
import { entityPost } from 'sharedConstants';
import wind from './postWind';
import './postPayloadApp';

hookUpEditBarEvents(wind.EID, entityPost);
