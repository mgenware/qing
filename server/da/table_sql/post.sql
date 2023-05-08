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

CREATE TABLE `post` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`content` TEXT NOT NULL,
	`created_at` DATETIME(3) NOT NULL,
	`modified_at` DATETIME(3) NOT NULL,
	`cmt_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`likes` INT UNSIGNED NOT NULL DEFAULT 0,
	`user_id` BIGINT UNSIGNED NOT NULL,
	`title` VARCHAR(200) NOT NULL,
	`last_replied_at` DATETIME(3) NULL DEFAULT NULL,
	`summary` TEXT NOT NULL,
	PRIMARY KEY (`id`),
	CONSTRAINT FOREIGN KEY(`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;
