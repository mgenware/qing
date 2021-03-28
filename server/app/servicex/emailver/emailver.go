/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package emailver

import (
	"encoding/base64"
	"fmt"
	"qing/app/extern/redisx"
	"strings"

	"github.com/google/uuid"
)

var compSep = "|"

// EmailVerificator provides support for vefirying user email during registration.
type EmailVerificator struct {
	prefix  string
	timeout int
	conn    *redisx.Conn
}

// NewEmailVerificator creates a new EmailVerificator.
func NewEmailVerificator(conn *redisx.Conn, prefix string, timeout int) *EmailVerificator {
	return &EmailVerificator{conn: conn, prefix: prefix, timeout: timeout}
}

// Add creates an in-memory entry with the specified email formatter as key and a associated value.
// This adds 2 entries to the backing store:
//  "<prefix>:email-to-id:<email>" = "<ID>"
//  "<prefix>:id-to-data:<ID>" = "<data>"
// ID: base64WithoutPadding(<email>:<UUID>)
func (ev *EmailVerificator) Add(email, data string) (string, error) {
	// Check if there is a pending entry for this email.
	emailToIDKey := ev.getEmailToIDKey(email)
	pendingID, err := ev.conn.GetStringValue(emailToIDKey)

	// Ignore key not found error.
	if err != nil && err != redisx.ErrNil {
		return "", err
	}
	if pendingID != "" {
		// Remove pending entry.
		idToDataKey := ev.getIDToDataKey(email, pendingID)

		// Ignore removal error (that entry may expire before we check it).
		ev.conn.RemoveValue(idToDataKey)
	}

	// Set new entries.
	id, err := ev.createID(email)
	if err != nil {
		return "", err
	}
	idToDataKey := ev.getIDToDataKey(email, id)
	err = ev.conn.SetStringValue(idToDataKey, data, ev.timeout)
	if err != nil {
		return "", err
	}
	err = ev.conn.SetStringValue(emailToIDKey, id, ev.timeout)
	if err != nil {
		return "", err
	}
	return id, nil
}

// Verify returns if the given ID exists in memory store, and remove existing value. An empty string indicates the value you are querying does not exist in memory store.
func (ev *EmailVerificator) Verify(id string) (string, error) {
	email, err := ev.getEmailFromID(id)
	if err != nil {
		return "", err
	}

	// Getting data from memory store.
	data, err := ev.conn.GetStringValue(ev.getIDToDataKey(email, id))
	if err != nil {
		// Key not found in memory store.
		if err == redisx.ErrNil {
			return "", nil
		}
		return "", err
	}

	// Value found, remove two keys associated.
	// Ignore deletion error.
	ev.conn.RemoveValue(ev.getIDToDataKey(email, id))
	ev.conn.RemoveValue(ev.getEmailToIDKey(email))

	// Return the fetched value.
	return data, nil
}

func (ev *EmailVerificator) getEmailToIDKey(email string) string {
	return ev.prefix + ":email-to-id:" + email
}

func (ev *EmailVerificator) getIDToDataKey(email, id string) string {
	return ev.prefix + ":id-to-data:" + email + ":" + id
}

func (ev *EmailVerificator) createID(email string) (string, error) {
	idObj, err := uuid.NewRandom()
	if err != nil {
		return "", err
	}
	uuid := idObj.String()
	return base64.RawStdEncoding.EncodeToString([]byte(email + compSep + uuid)), nil
}

func (ev *EmailVerificator) invalidInputErr(str string) error {
	return fmt.Errorf("Invalid input \"%v\"", str)
}

func (ev *EmailVerificator) getEmailFromID(id string) (string, error) {
	decodedBytes, err := base64.RawStdEncoding.DecodeString(id)
	if err != nil {
		return "", ev.invalidInputErr(id)
	}

	parts := strings.Split(string(decodedBytes), compSep)
	if len(parts) == 0 {
		return "", ev.invalidInputErr(id)
	}
	return parts[0], nil
}
