/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import appPageState from 'app/appPageState';
import { CHECK } from 'checks';

export interface QuestionWind {
  QuestionID: string;
  ForumID: string;
}

const wind = appPageState.windData<QuestionWind>();
CHECK(wind.ForumID);
CHECK(wind.QuestionID);
export default wind;
