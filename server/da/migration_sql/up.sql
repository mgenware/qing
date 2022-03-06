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
	`admin` TINYINT NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`)
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `user_stats` (
	`id` BIGINT UNSIGNED NOT NULL,
	`post_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`discussion_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`question_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`answer_count` INT UNSIGNED NOT NULL DEFAULT 0,
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

CREATE TABLE `cmt` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`parent_id` BIGINT UNSIGNED NULL DEFAULT NULL,
	`content` TEXT NOT NULL,
	`user_id` BIGINT UNSIGNED NOT NULL,
	`reply_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`likes` INT UNSIGNED NOT NULL DEFAULT 0,
	`created_at` DATETIME NOT NULL,
	`modified_at` DATETIME NOT NULL,
	`del_flag` TINYINT UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`),
	CONSTRAINT FOREIGN KEY(`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `post` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`content` TEXT NOT NULL,
	`user_id` BIGINT UNSIGNED NOT NULL,
	`created_at` DATETIME NOT NULL,
	`modified_at` DATETIME NOT NULL,
	`cmt_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`title` VARCHAR(200) NOT NULL,
	`likes` INT UNSIGNED NOT NULL DEFAULT 0,
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

CREATE TABLE `discussion` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`content` TEXT NOT NULL,
	`user_id` BIGINT UNSIGNED NOT NULL,
	`created_at` DATETIME NOT NULL,
	`modified_at` DATETIME NOT NULL,
	`cmt_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`title` VARCHAR(200) NOT NULL,
	`forum_id` BIGINT UNSIGNED NULL DEFAULT NULL,
	`reply_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`last_replied_at` DATETIME NULL DEFAULT NULL,
	`votes` INT UNSIGNED NOT NULL DEFAULT 0,
	`up_votes` INT UNSIGNED NOT NULL DEFAULT 0,
	`down_votes` INT UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`),
	CONSTRAINT FOREIGN KEY(`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`forum_id`) REFERENCES `forum` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `discussion_cmt` (
	`cmt_id` BIGINT UNSIGNED NOT NULL,
	`host_id` BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY (`cmt_id`, `host_id`),
	CONSTRAINT FOREIGN KEY(`cmt_id`) REFERENCES `cmt` (`id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`host_id`) REFERENCES `discussion` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `discussion_msg` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`content` TEXT NOT NULL,
	`user_id` BIGINT UNSIGNED NOT NULL,
	`created_at` DATETIME NOT NULL,
	`modified_at` DATETIME NOT NULL,
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

CREATE TABLE `discussion_msg_cmt` (
	`cmt_id` BIGINT UNSIGNED NOT NULL,
	`host_id` BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY (`cmt_id`, `host_id`),
	CONSTRAINT FOREIGN KEY(`cmt_id`) REFERENCES `cmt` (`id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`host_id`) REFERENCES `discussion_msg` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `question` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`content` TEXT NOT NULL,
	`user_id` BIGINT UNSIGNED NOT NULL,
	`created_at` DATETIME NOT NULL,
	`modified_at` DATETIME NOT NULL,
	`cmt_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`title` VARCHAR(200) NOT NULL,
	`forum_id` BIGINT UNSIGNED NULL DEFAULT NULL,
	`reply_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`last_replied_at` DATETIME NULL DEFAULT NULL,
	`likes` INT UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`),
	CONSTRAINT FOREIGN KEY(`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`forum_id`) REFERENCES `forum` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `question_cmt` (
	`cmt_id` BIGINT UNSIGNED NOT NULL,
	`host_id` BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY (`cmt_id`, `host_id`),
	CONSTRAINT FOREIGN KEY(`cmt_id`) REFERENCES `cmt` (`id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`host_id`) REFERENCES `question` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `answer` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`content` TEXT NOT NULL,
	`user_id` BIGINT UNSIGNED NOT NULL,
	`created_at` DATETIME NOT NULL,
	`modified_at` DATETIME NOT NULL,
	`cmt_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`question_id` BIGINT UNSIGNED NOT NULL,
	`votes` INT NOT NULL DEFAULT 0,
	`up_votes` INT UNSIGNED NOT NULL DEFAULT 0,
	`down_votes` INT UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`),
	CONSTRAINT FOREIGN KEY(`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `answer_cmt` (
	`cmt_id` BIGINT UNSIGNED NOT NULL,
	`host_id` BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY (`cmt_id`, `host_id`),
	CONSTRAINT FOREIGN KEY(`cmt_id`) REFERENCES `cmt` (`id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`host_id`) REFERENCES `answer` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `forum` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(100) NOT NULL,
	`desc` TEXT NOT NULL,
	`order_index` INT UNSIGNED NOT NULL DEFAULT 0,
	`created_at` DATETIME NOT NULL,
	`group_id` BIGINT UNSIGNED NULL DEFAULT NULL,
	`thread_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`status` TINYINT UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`),
	CONSTRAINT FOREIGN KEY(`group_id`) REFERENCES `forum_group` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `forum_group` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(100) NOT NULL,
	`desc` TEXT NOT NULL,
	`order_index` INT UNSIGNED NOT NULL DEFAULT 0,
	`created_at` DATETIME NOT NULL,
	`forum_count` INT UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`)
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

CREATE TABLE `question_like` (
	`user_id` BIGINT UNSIGNED NOT NULL,
	`host_id` BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY (`user_id`, `host_id`),
	CONSTRAINT FOREIGN KEY(`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`host_id`) REFERENCES `question` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;

CREATE TABLE `answer_vote` (
	`user_id` BIGINT UNSIGNED NOT NULL,
	`host_id` BIGINT UNSIGNED NOT NULL,
	`vote` TINYINT NOT NULL,
	PRIMARY KEY (`user_id`, `host_id`),
	CONSTRAINT FOREIGN KEY(`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`host_id`) REFERENCES `answer` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;
