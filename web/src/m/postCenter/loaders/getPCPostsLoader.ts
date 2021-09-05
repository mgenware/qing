/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import PaginatedList from 'lib/api/paginatedList';
import Loader from 'lib/loader';
import routes from 'routes';
import { entityPost, entityDiscussion, entityQuestion } from 'sharedConstants';
import PCPost from '../pcPost';

export class GetPCPostsLoader extends Loader<PaginatedList<PCPost>> {
  constructor(
    public entityType: number,
    public page: number,
    public pageSize: number,
    public sortedColumn: string,
    public desc: boolean,
  ) {
    super();
  }

  requestURL(): string {
    switch (this.entityType) {
      case entityPost:
        return routes.s.pri.mp.posts;

      case entityDiscussion:
        return routes.s.pri.mp.discussions;

      case entityQuestion:
        return routes.s.pri.mp.questions;

      default:
        throw new Error(`Unsupported entity type ${this.entityType}`);
    }
  }

  requestParams(): Record<string, unknown> {
    return {
      page: this.page,
      pageSize: this.pageSize,
      sort: this.sortedColumn,
      desc: +this.desc,
    };
  }
}
