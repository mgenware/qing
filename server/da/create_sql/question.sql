/******************************************************************************************
 * This file was automatically generated by mingru (https://github.com/mgenware/mingru)
 * Do not edit this file manually, your changes will be overwritten.
 ******************************************************************************************/

CREATE TABLE `question` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`content` TEXT NOT NULL,
	`user_id` BIGINT UNSIGNED NOT NULL,
	`created_at` DATETIME NOT NULL,
	`modified_at` DATETIME NULL DEFAULT NULL,
	`cmt_count` INT UNSIGNED NOT NULL DEFAULT 0,
	`title` VARCHAR(255) NOT NULL,
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
