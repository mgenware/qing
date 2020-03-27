package cm

import "encoding/json"

// User contains user infomation stored in session store
type User struct {
	ID       uint64 `json:"id"`
	Name     string `json:"name"`
	IconName string `json:"icon"`

	// Generated props when deserialized
	URL     string `json:"-"`
	IconURL string `json:"-"`
	EID     string `json:"-"`
}

// Serialize encode the user object to JSON.
func (u *User) Serialize() (string, error) {
	b, err := json.Marshal(u)
	if err != nil {
		return "", err
	}
	return string(b), nil
}
