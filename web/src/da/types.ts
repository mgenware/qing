/* eslint-disable */

/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

/******************************************************************************************
 * This file was automatically generated by mingru (https://github.com/mgenware/mingru)
 * Do not edit this file manually, your changes will be overwritten.
 ******************************************************************************************/

export interface DBCmt {
  cmtCount?: number;
  contentHTML?: string;
  delFlag?: number;
  hostID?: number;
  hostType?: number;
  isLiked?: number;
  likes?: number;
  userName?: string;
}

export interface DBEntitySrc {
  contentHTML?: string;
  contentSrc?: string;
  title?: string;
}

export interface DBUserForEditing {
  bioHTML?: string;
  bioSrc?: string;
  company?: string;
  location?: string;
  name?: string;
  website?: string;
}
