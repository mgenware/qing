/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import routes from './routes';

export function staticMainImage(file: string): string {
  return `${routes.static.img.main}/${file}`;
}
