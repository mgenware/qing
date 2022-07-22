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

CREATE TABLE `f_post_cmt` (
	`cmt_id` BIGINT UNSIGNED NOT NULL,
	`host_id` BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY (`cmt_id`, `host_id`),
	CONSTRAINT FOREIGN KEY(`cmt_id`) REFERENCES `cmt` (`id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`host_id`) REFERENCES `f_post` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;
