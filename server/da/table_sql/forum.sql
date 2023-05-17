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

CREATE TABLE `forum` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(100) NOT NULL,
	`desc` TEXT NOT NULL,
	`desc_src` TEXT NULL DEFAULT NULL,
	`order_index` INT UNSIGNED NOT NULL DEFAULT 0,
	`created_at` DATETIME(3) NOT NULL,
	`group_id` BIGINT UNSIGNED NULL DEFAULT NULL,
	`fpost_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`status` TINYINT UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`),
	CONSTRAINT FOREIGN KEY(`group_id`) REFERENCES `forum_group` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;
