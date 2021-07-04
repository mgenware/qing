/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

INSERT INTO `user` (`id`, `email`, `name`, `icon_name`, `url_name`, `created_at`, `company`, `website`, `location`, `bio`, `admin`, `status`)
VALUES
	(101, 'm@admin.com', 'ADMIN', 'admin.png', NULL, '1990-10-27 10:20:30', 'ADMIN_COMPANY', 'ADMIN_WEBSITE', 'ADMIN_LOC', NULL, 1, ''),
	(102, 'm@user.com', 'USER', 'user.png', NULL, '1990-10-27 10:20:30', 'USER_COMPANY', 'USER_WEBSITE', 'USER_LOC', NULL, 0, ''),
	(103, 'm@admin2.com', 'ADMIN2', 'admin2.png', NULL, '1990-10-27 10:20:30', 'ADMIN2_COMPANY', 'ADMIN2_WEBSITE', 'ADMIN2_LOC', NULL, 1, ''),
	(104, 'm@user2.com', 'USER2', 'user2.png', NULL, '1990-10-27 10:20:30', 'USER2_COMPANY', 'USER2_WEBSITE', 'USER2_LOC', NULL, 0, '');

INSERT INTO `user_stats` (`id`)
VALUES (101), (102), (103), (104);