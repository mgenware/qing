CREATE TABLE `user_pwd` (
	`id` BIGINT UNSIGNED NOT NULL,
	`pwd_hash` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`)
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;
