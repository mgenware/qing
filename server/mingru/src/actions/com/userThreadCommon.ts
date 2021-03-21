/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase';
import { Post } from '../../models/post/post';
import user from '../../models/user/user';
import { Discussion } from '../../models/discussion/discussion';
import { Question } from '../../models/qna/question';

/**
 * In order to support selecting all kinds of user threads and reuse code for difference
 *  scenarios (e.g. select questions in home page tab, select all threads including
 *  questions in home page, select questions in a specific forum, etc).
 *
 * All thread SELECT actions have a single result type with an optional thread type column
 * for UNION SELECT. Our backend may generates different template results based on
 * different thread types.
 *
 * NOTE: To run UNION SELECT successfully, each SELECT must have exact same number of columns.
 * That's why each type always has 3 values defined even some might not be used.
 *
 * Posts:
 * value1 = likes, value2 = comments, value3 = 0.
 *
 * Discussions:
 * value1 = replies, value2 = 0, value3 = 0.
 *
 * Questions
 * value1 = answers, value2 = up votes, value3 = down votes.
 */

export const userThreadInterface = 'UserThreadInterface';
export const userThreadTypeColumnName = 'threadType';
export const userThreadValue1ColumnName = 'value1';
export const userThreadValue2ColumnName = 'value2';
export const userThreadValue3ColumnName = 'value3';

function getCommonThreadCols(t: ContentBase): mm.SelectedColumn[] {
  const joinedUserTable = t.user_id.join(user);
  const userCols = [t.id, t.user_id, joinedUserTable.name, joinedUserTable.icon_name].map((c) =>
    c.privateAttr(),
  );
  return [...userCols, t.created_at, t.modified_at];
}

function placeholderValueColumn(name: string): mm.RawColumn {
  return mm.sel(mm.sql`0`, name, mm.uInt().__mustGetType());
}

export function getUserPostCols(t: Post): mm.SelectedColumn[] {
  return [
    ...getCommonThreadCols(t),
    t.title,
    t.likes.as(userThreadValue1ColumnName),
    t.cmt_count.as(userThreadValue2ColumnName),
    placeholderValueColumn(userThreadValue3ColumnName),
  ];
}

export function getUserDiscussionCols(
  t: Discussion,
  includeLastReplied: boolean,
): mm.SelectedColumn[] {
  const cols = [
    ...getCommonThreadCols(t),
    t.title,
    t.reply_count.as(userThreadValue1ColumnName),
    placeholderValueColumn(userThreadValue2ColumnName),
    placeholderValueColumn(userThreadValue3ColumnName),
  ];
  if (includeLastReplied) {
    cols.push(t.last_replied_at);
  }
  return cols;
}

export function getUserQuestionCols(t: Question, includeLastReplied: boolean): mm.SelectedColumn[] {
  const cols = [
    ...getCommonThreadCols(t),
    t.title,
    t.reply_count.as(userThreadValue1ColumnName),
    t.up_votes.as(userThreadValue2ColumnName),
    t.down_votes.as(userThreadValue3ColumnName),
  ];
  if (includeLastReplied) {
    cols.push(t.last_replied_at);
  }
  return cols;
}
