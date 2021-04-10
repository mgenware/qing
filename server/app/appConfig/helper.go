/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package appConfig

import "path/filepath"

func ResolvePath(p string) string {
	return filepath.Join(confDir, p)
}

// getDefaultConfigFilePath returns a config file path in default app config dir.
func getDefaultConfigFilePath(name string) string {
	return filepath.Join("../userland/", name)
}
