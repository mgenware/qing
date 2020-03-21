CREATE TABLE `user` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	`icon_name` VARCHAR(255) NOT NULL,
	`created_time` DATETIME NOT NULL,
	`company` VARCHAR(100) NOT NULL,
	`website` VARCHAR(100) NOT NULL,
	`location` VARCHAR(100) NOT NULL,
	`bio` TEXT NULL DEFAULT NULL,
	`post_count` INT UNSIGNED NOT NULL,
	PRIMARY KEY (`id`)
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;
