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
	`bio_src` TEXT NULL DEFAULT NULL,
	`lang` VARCHAR(10) NOT NULL DEFAULT '',
	`reg_lang` VARCHAR(10) NOT NULL,
	`admin` TINYINT NOT NULL DEFAULT 0,
	`pri_account` TINYINT NOT NULL DEFAULT 0,
	`no_noti` TINYINT NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`)
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `user_stats` (
	`id` BIGINT UNSIGNED NOT NULL,
	`post_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`fpost_count` INT UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`)
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `user_auth` (
	`id` BIGINT UNSIGNED NOT NULL,
	`auth_type` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`)
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `user_pwd` (
	`id` BIGINT UNSIGNED NOT NULL,
	`pwd_hash` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`)
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `forum_group` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(100) NOT NULL,
	`desc` TEXT NOT NULL,
	`desc_src` TEXT NULL DEFAULT NULL,
	`order_index` INT UNSIGNED NOT NULL DEFAULT 0,
	`created_at` DATETIME NOT NULL,
	`forum_count` INT UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`)
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `forum` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(100) NOT NULL,
	`desc` TEXT NOT NULL,
	`desc_src` TEXT NULL DEFAULT NULL,
	`order_index` INT UNSIGNED NOT NULL DEFAULT 0,
	`created_at` DATETIME NOT NULL,
	`group_id` BIGINT UNSIGNED NULL DEFAULT NULL,
	`fpost_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`status` TINYINT UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`),
	CONSTRAINT FOREIGN KEY(`group_id`) REFERENCES `forum_group` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `forum_mod` (
	`object_id` BIGINT UNSIGNED NOT NULL,
	`user_id` BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY (`object_id`, `user_id`),
	CONSTRAINT FOREIGN KEY(`object_id`) REFERENCES `forum` (`id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `forum_group_mod` (
	`object_id` BIGINT UNSIGNED NOT NULL,
	`user_id` BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY (`object_id`, `user_id`),
	CONSTRAINT FOREIGN KEY(`object_id`) REFERENCES `forum_group` (`id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `forum_is_user_mod` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (`id`)
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `cmt` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`content` TEXT NOT NULL,
	`content_src` TEXT NULL DEFAULT NULL,
	`created_at` DATETIME NOT NULL,
	`modified_at` DATETIME NOT NULL,
	`cmt_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`likes` INT UNSIGNED NOT NULL DEFAULT 0,
	`user_id` BIGINT UNSIGNED NULL DEFAULT NULL,
	`parent_id` BIGINT UNSIGNED NULL DEFAULT NULL,
	`del_flag` TINYINT UNSIGNED NOT NULL DEFAULT 0,
	`host_id` BIGINT UNSIGNED NOT NULL,
	`host_type` TINYINT UNSIGNED NOT NULL,
	PRIMARY KEY (`id`),
	CONSTRAINT FOREIGN KEY(`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`parent_id`) REFERENCES `cmt` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `post` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`content` TEXT NOT NULL,
	`content_src` TEXT NULL DEFAULT NULL,
	`created_at` DATETIME NOT NULL,
	`modified_at` DATETIME NOT NULL,
	`cmt_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`likes` INT UNSIGNED NOT NULL DEFAULT 0,
	`user_id` BIGINT UNSIGNED NOT NULL,
	`title` VARCHAR(200) NOT NULL,
	`last_replied_at` DATETIME NULL DEFAULT NULL,
	`summary` VARCHAR(300) NOT NULL,
	PRIMARY KEY (`id`),
	CONSTRAINT FOREIGN KEY(`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `post_cmt` (
	`cmt_id` BIGINT UNSIGNED NOT NULL,
	`host_id` BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY (`cmt_id`, `host_id`),
	CONSTRAINT FOREIGN KEY(`cmt_id`) REFERENCES `cmt` (`id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`host_id`) REFERENCES `post` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `f_post` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`content` TEXT NOT NULL,
	`content_src` TEXT NULL DEFAULT NULL,
	`created_at` DATETIME NOT NULL,
	`modified_at` DATETIME NOT NULL,
	`cmt_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`likes` INT UNSIGNED NOT NULL DEFAULT 0,
	`user_id` BIGINT UNSIGNED NOT NULL,
	`title` VARCHAR(200) NOT NULL,
	`last_replied_at` DATETIME NULL DEFAULT NULL,
	`summary` VARCHAR(300) NOT NULL,
	`forum_id` BIGINT UNSIGNED NULL DEFAULT NULL,
	PRIMARY KEY (`id`),
	CONSTRAINT FOREIGN KEY(`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`forum_id`) REFERENCES `forum` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

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

CREATE TABLE `post_like` (
	`user_id` BIGINT UNSIGNED NOT NULL,
	`host_id` BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY (`user_id`, `host_id`),
	CONSTRAINT FOREIGN KEY(`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`host_id`) REFERENCES `post` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `cmt_like` (
	`user_id` BIGINT UNSIGNED NOT NULL,
	`host_id` BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY (`user_id`, `host_id`),
	CONSTRAINT FOREIGN KEY(`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`host_id`) REFERENCES `cmt` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `f_post_like` (
	`user_id` BIGINT UNSIGNED NOT NULL,
	`host_id` BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY (`user_id`, `host_id`),
	CONSTRAINT FOREIGN KEY(`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`host_id`) REFERENCES `f_post` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;
