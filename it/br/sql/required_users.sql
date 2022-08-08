/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

INSERT INTO `user` (`id`, `email`, `name`, `icon_name`, `created_at`, `company`, `website`, `location`, `bio`, `admin`)
VALUES
	(101, 'admin@mgenware.com', 'ADMIN', 'admin.png', '2019-01-31 10:20:30', 'ADMIN_COMPANY', 'ADMIN_WEBSITE', 'ADMIN_LOC', NULL, 1),
	(102, 'user@mgenware.com', 'USER', 'user.png', '2019-01-31 10:20:30', 'USER_COMPANY', 'USER_WEBSITE', 'USER_LOC', NULL, 0),
	(103, 'admin2@mgenware.com', 'ADMIN2', 'admin2.png', '2019-01-31 10:20:30', 'ADMIN2_COMPANY', 'ADMIN2_WEBSITE', 'ADMIN2_LOC', NULL, 1),
	(104, 'user2@mgenware.com', 'USER2', 'user2.png', '2019-01-31 10:20:30', 'USER2_COMPANY', 'USER2_WEBSITE', 'USER2_LOC', NULL, 0);

INSERT INTO `user_stats` (`id`)
VALUES (101), (102), (103), (104);

INSERT INTO `user_auth` (`id`, `auth_type`)
VALUES
	(102, 1);

INSERT INTO `user_pwd` (`id`, `pwd_hash`)
VALUES
	(102, '$argon2id$v=19$m=65536,t=3,p=2$3o4Bu3Id6rxfnzjILzocWg$38dBvyzb0PvShDnSPlCOMGd18N0XDRCBWhFEuNbnxBs');

