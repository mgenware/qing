package appcom

import "encoding/json"

// SessionUser contains user infomation stored in a session store.
type SessionUser struct {
	ID       uint64 `json:"id"`
	Name     string `json:"name"`
	IconName string `json:"icon"`
	Admin    bool   `json:"admin"`

	// Generated props when deserialized
	URL     string `json:"-"`
	IconURL string `json:"-"`
	EID     string `json:"-"`
}

// Serialize encode the user object to JSON.
func (u *SessionUser) Serialize() (string, error) {
	b, err := json.Marshal(u)
	if err != nil {
		return "", err
	}
	return string(b), nil
}
