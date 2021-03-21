/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

package avatar

import "fmt"

func GetAvatarURL(prefix string, uid uint64, size int, avatarName string) string {
	return fmt.Sprintf("/%v/%v/%v_%v", prefix, uid, size, avatarName)
}
