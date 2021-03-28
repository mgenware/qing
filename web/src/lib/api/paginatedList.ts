/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

export default interface PaginatedList<T> {
  items: T[];
  hasNext: boolean;
  totalCount: number;
}
