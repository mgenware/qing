package authapi

import (
	"encoding/json"
	"fmt"
	"net/http"
	"qing/app"
	"qing/app/cm"
	"qing/app/handler"
	"qing/lib/validator"
)

// CreateUserData contains the information stored in memory store during user email verification.
type CreateUserData struct {
	Email string
	Name  string
	Pwd   string
}

// CreateUserDataToString serializes a CreateUserData to string.
func CreateUserDataToString(d *CreateUserData) (string, error) {
	bytes, err := json.Marshal(d)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

// StringToCreateUserData deserializes a string to CreateUserData.
func StringToCreateUserData(str string) (*CreateUserData, error) {
	var d CreateUserData
	err := json.Unmarshal([]byte(str), &d)
	if err != nil {
		return nil, err
	}
	return &d, nil
}

func createPwdUserPOST(w http.ResponseWriter, r *http.Request) handler.JSON {
	resp := app.JSONResponse(w, r)
	params := cm.BodyContext(r.Context())

	email := validator.MustGetStringFromDict(params, "email")
	pwd := validator.MustGetStringFromDict(params, "pwd")

	// Put user pwd to memory store and wait for user email verification.
	publicID, err := app.Service.RegEmailVerificator.Add(email, pwd)
	if err != nil {
		panic(fmt.Sprintf("RegEmailVerificator.Add failed: %v", err.Error()))
	}
	url := app.URL.RegEmailVerification(publicID)

	// TODO: send email.

	// Print URL to console for debugging purposes.
	if app.Config.DevMode() {
		fmt.Printf("[DEBUG] reg-v-url: %v\n", url)
	}
	return resp.MustComplete(nil)
}
