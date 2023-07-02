/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package emailveri

import (
	"encoding/base64"
	"fmt"
	"qing/a/coretype"
	"strings"
	"time"

	"github.com/google/uuid"
)

var compSep = "|"

// EmailVerifier provides support for verifying user emails.
type EmailVerifier struct {
	prefix  string
	timeout time.Duration
	conn    coretype.CoreMemoryStoreConn
}

// NewEmailVerifier creates a new EmailVerifier.
func NewEmailVerifier(conn coretype.CoreMemoryStoreConn, prefix string, timeout time.Duration) *EmailVerifier {
	return &EmailVerifier{conn: conn, prefix: prefix, timeout: timeout}
}

// Add creates an in-memory entry with the specified email formatter as key and a associated value.
// This adds 2 entries to the backing store:
//
//	"<prefix>:email->id:<email>" = "<ID>"
//	"<prefix>:id->data:<ID>" = "<data>"
//
// ID: base64WithoutPadding(<email>:<UUID>)
func (ev *EmailVerifier) Add(email, data string) (string, error) {
	// Check if there is a pending entry for this email.
	emailToIDKey := ev.getEmailToIDKey(email)
	_, pendingID, err := ev.conn.GetStringValue(emailToIDKey)
	if err != nil {
		return "", err
	}
	if pendingID != "" {
		// Remove pending entry.
		idToDataKey := ev.getIDToDataKey(email, pendingID)

		// Ignore removal error (that entry may expire before we check it).
		ev.conn.RemoveValue(idToDataKey) //nolint:errcheck
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

// Verify returns if the given ID exists in memory store, and remove existing value.
// An empty string indicates the value you are querying does not exist in memory store.
func (ev *EmailVerifier) Verify(id string) (string, error) {
	email, err := ev.getEmailFromID(id)
	if err != nil {
		return "", err
	}

	// Getting data from memory store.
	_, data, err := ev.conn.GetStringValue(ev.getIDToDataKey(email, id))
	if err != nil {
		return "", err
	}
	if data == "" {
		return "", nil
	}

	// Value found, remove two keys associated.
	// Ignore deletion error.
	ev.conn.RemoveValue(ev.getIDToDataKey(email, id)) //nolint:errcheck
	ev.conn.RemoveValue(ev.getEmailToIDKey(email))    //nolint:errcheck

	// Return the fetched value.
	return data, nil
}

func (ev *EmailVerifier) getEmailToIDKey(email string) string {
	return ev.prefix + ":email->id:" + email
}

func (ev *EmailVerifier) getIDToDataKey(email, id string) string {
	return ev.prefix + ":id->data:" + email + ":" + id
}

func (ev *EmailVerifier) createID(email string) (string, error) {
	idObj, err := uuid.NewRandom()
	if err != nil {
		return "", err
	}
	uuid := idObj.String()
	return base64.RawStdEncoding.EncodeToString([]byte(email + compSep + uuid)), nil
}

func (ev *EmailVerifier) invalidInputErr(str string) error {
	return fmt.Errorf("invalid input \"%v\"", str)
}

func (ev *EmailVerifier) getEmailFromID(id string) (string, error) {
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
