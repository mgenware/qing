/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import appPageState from 'app/appPageState';
import { CHECK } from 'checks';
import { QnaWind } from 'sod/qna/qnaWind';

const wind = appPageState.windData<QnaWind>();
CHECK(wind.questionID);
export default wind;
