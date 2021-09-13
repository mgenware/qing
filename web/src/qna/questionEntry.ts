/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { hookUpEditBarEvents } from 'com/postCore/postCoreLib';
import 'core';
import { entityQuestion } from 'sharedConstants';
import './questionApp';
import './addAnswerApp';
import wind from './questionWind';

hookUpEditBarEvents(wind.QuestionID, entityQuestion);
