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

CREATE TABLE `user_stats` (
	`id` BIGINT UNSIGNED NOT NULL,
	`post_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`fpost_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`thread_count` INT UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`)
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;
