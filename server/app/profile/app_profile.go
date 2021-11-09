/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package profile

import (
	"encoding/json"
	"log"
	"os"
	"qing/app/profile/profiles"

	"github.com/mgenware/goutil/iox"
)

// AppProfile stores information that controls how application runs. It is generated when application first runs.
type AppProfile struct {
	// Auth contains information about authentication.
	Auth *profiles.AuthData `json:"auth"`
}

func readAppProfileCore(file string) (*AppProfile, error) {
	log.Printf("🚙 Loading app profile at \"%v\"", file)
	var profile AppProfile

	bytes, err := os.ReadFile(file)
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(bytes, &profile)
	if err != nil {
		return nil, err
	}

	return &profile, nil
}

func writeAppProfile(profile *AppProfile, path string) error {
	log.Printf("🚗 Writing app profile to \"%v\"", path)

	bytes, err := json.Marshal(profile)
	if err != nil {
		return err
	}

	return os.WriteFile(path, bytes, 0644)
}

func newAppProfile() *AppProfile {
	profile := &AppProfile{
		Auth: profiles.NewAuthData(),
	}
	return profile
}

// GetAppProfile loads an app profile from the specified path, and creates one if it
// does not exist.
func GetAppProfile(file string) (bool, *AppProfile, error) {
	// Creates a new app profile if it does not exist.
	hasAppProfile, err := iox.FileExists(file)
	if err != nil {
		return false, nil, err
	}
	if !hasAppProfile {
		newProfile := newAppProfile()
		err := writeAppProfile(newProfile, file)
		if err != nil {
			return false, nil, err
		}
		return false, newProfile, nil
	}
	profile, err := readAppProfileCore(file)
	if err != nil {
		return false, nil, err
	}
	return hasAppProfile, profile, nil
}
