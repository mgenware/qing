/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

 /******************************************************************************************
  * This file was automatically generated by mingru (https://github.com/mgenware/mingru)
  * Do not edit this file manually, your changes will be overwritten.
  ******************************************************************************************/

CREATE TABLE `user` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`email` VARCHAR(200) NOT NULL UNIQUE,
	`name` VARCHAR(100) NOT NULL,
	`icon_name` VARCHAR(255) NOT NULL DEFAULT '',
	`created_at` DATETIME NOT NULL,
	`company` VARCHAR(100) NOT NULL DEFAULT '',
	`website` VARCHAR(200) NOT NULL DEFAULT '',
	`location` VARCHAR(100) NOT NULL DEFAULT '',
	`bio` TEXT NULL DEFAULT NULL,
	`admin` TINYINT NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`)
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;