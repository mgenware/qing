package cfg

import (
	"encoding/json"
	"io/ioutil"
	"log"
	appprofile "qing/app/cfg/app_profile"

	"github.com/mgenware/go-packagex/v5/iox"
)

// AppProfile stores information that controls how application runs. It is generated when application first runs.
type AppProfile struct {
	// Auth contains information about authentication.
	Auth *appprofile.AuthData `json:"auth"`
}

func readAppProfileCore(file string) (*AppProfile, error) {
	log.Printf("🚙 Loading app profile at \"%v\"", file)
	var profile AppProfile

	bytes, err := ioutil.ReadFile(file)
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(bytes, &profile)
	if err != nil {
		return nil, err
	}

	return &profile, nil
}

func newAppProfile() *AppProfile {
	profile := &AppProfile{
		Auth: appprofile.NewAuthData(),
	}
	return profile
}

// GetAppProfile loads an app profile from the specified path, and creates one if it
// does not exist.
func GetAppProfile(file string) (*Config, error) {
	// Creates a new app profile if it does not exist.
	if !iox.FileExists(file) {
		return newAppProfile(), nil
	}
	config, err := readAppProfileCore(file)
	if err != nil {
		return nil, err
	}
	err = config.validateAndCoerce()
	if err != nil {
		return nil, err
	}
	return config, nil
}
