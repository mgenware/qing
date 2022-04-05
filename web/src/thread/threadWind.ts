/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import appPageState from 'app/appPageState';
import { CHECK } from 'checks';
import { ThreadWind } from 'sod/thread/threadWind';

const wind = appPageState.windData<ThreadWind>();
CHECK(wind.threadID);
export default wind;
