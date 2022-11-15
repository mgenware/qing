/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import PaginatedList from 'lib/api/paginatedList';
import Loader from 'lib/loader';
import * as mpRoute from '@qing/routes/d/s/pri/mp';
import { appdef } from '@qing/def';
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

  override requestURL(): string {
    switch (this.entityType) {
      case appdef.ContentBaseType.post:
        return mpRoute.posts;

      case appdef.ContentBaseType.fPost:
        return mpRoute.fposts;

      default:
        throw new Error(`Unsupported entity type ${this.entityType}`);
    }
  }

  override requestParams(): Record<string, unknown> {
    return {
      page: this.page,
      pageSize: this.pageSize,
      sort: this.sortedColumn,
      desc: +this.desc,
    };
  }
}
