CREATE TABLE `forum_post_cmt` (
	`cmt_id` BIGINT UNSIGNED NOT NULL,
	`host_id` BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY (`cmt_id`, `host_id`),
	CONSTRAINT FOREIGN KEY(`cmt_id`) REFERENCES `cmt` (`id`) ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY(`host_id`) REFERENCES `thread_msg` (`id`) ON DELETE CASCADE
)
CHARACTER SET=utf8mb4
COLLATE=utf8mb4_unicode_ci
;
