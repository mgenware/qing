/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from './loader';

export default class FileUploadLoader<T> extends Loader<T> {
  constructor(public formData: FormData) {
    super();
  }

  override fetchParams(): RequestInit {
    return {
      method: 'POST',
      body: this.formData,
    };
  }
}
