/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

 /******************************************************************************************
  * This file was automatically generated by mingru (https://github.com/mgenware/mingru)
  * Do not edit this file manually, your changes will be overwritten.
  ******************************************************************************************/

CREATE TABLE `discussion_msg` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`content` TEXT NOT NULL,
	`user_id` BIGINT UNSIGNED NOT NULL,
	`created_at` DATETIME NOT NULL,
	`modified_at` DATETIME NULL DEFAULT NULL,
	`cmt_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`discussion_id` BIGINT UNSIGNED NOT NULL,
	`votes` INT UNSIGNED NOT NULL DEFAULT 0,
	`up_votes` INT UNSIGNED NOT NULL DEFAULT 0,
	`down_votes` INT UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`),
	CONSTRAINT FOREIGN KEY(`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`discussion_id`) REFERENCES `discussion` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;
