/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package msveri

import (
	"encoding/base64"
	"fmt"
	"qing/a/coretype"
	"strings"
	"time"

	"github.com/google/uuid"
)

var compSep = "|"

type MSVerifier struct {
	prefix  string
	timeout time.Duration
	conn    coretype.CoreMemoryStoreConn
}

func NewMSVerifier(conn coretype.CoreMemoryStoreConn, prefix string, timeout time.Duration) *MSVerifier {
	return &MSVerifier{conn: conn, prefix: prefix, timeout: timeout}
}

// Sets an in-memory entry with the specified user string as a key and a associated value.
// This adds 2 entries to the backing store:
//
//	"<prefix>:user->id:<user>" = "<ID>"
//	"<prefix>:id->data:<ID>" = "<data>"
//
// ID: base64WithoutPadding(<user>:<UUID>)
func (ev *MSVerifier) Set(user, data string) (string, error) {
	// Check if there is a pending entry for this user.
	userToIDKey := ev.getUserToIDKey(user)
	_, pendingID, err := ev.conn.GetStringValue(userToIDKey)
	if err != nil {
		return "", err
	}
	if pendingID != "" {
		// Remove pending entry.
		idToDataKey := ev.getIDToDataKey(user, pendingID)

		// Ignore removal error (that entry may expire before we check it).
		ev.conn.RemoveValue(idToDataKey) //nolint:errcheck
	}

	// Set new entries.
	id, err := ev.createID(user)
	if err != nil {
		return "", err
	}
	idToDataKey := ev.getIDToDataKey(user, id)
	err = ev.conn.SetStringValue(idToDataKey, data, ev.timeout)
	if err != nil {
		return "", err
	}
	err = ev.conn.SetStringValue(userToIDKey, id, ev.timeout)
	if err != nil {
		return "", err
	}
	return id, nil
}

// Verify returns if the given ID exists in memory store, and remove existing value.
// An empty string indicates the value you are querying does not exist in memory store.
func (ev *MSVerifier) Verify(id string) (string, error) {
	return ev.verifyCore(id, true)
}

// Unlike Verify, Peak does not remove the value when a match is found.
func (ev *MSVerifier) Peak(id string) (string, error) {
	return ev.verifyCore(id, false)
}

func (ev *MSVerifier) verifyCore(id string, remove bool) (string, error) {
	user, err := ev.getUserFromID(id)
	if err != nil {
		return "", err
	}

	// Getting data from memory store.
	_, data, err := ev.conn.GetStringValue(ev.getIDToDataKey(user, id))
	if err != nil {
		return "", err
	}
	if data == "" {
		return "", nil
	}

	if remove {
		// Value found, remove all associated keys.
		ev.removeCore(id, user)
	}

	// Return the fetched value.
	return data, nil
}

func (ev *MSVerifier) removeCore(id, user string) {
	// Ignore deletion error.
	ev.conn.RemoveValue(ev.getIDToDataKey(user, id)) //nolint:errcheck
	ev.conn.RemoveValue(ev.getUserToIDKey(user))     //nolint:errcheck
}

func (ev *MSVerifier) getUserToIDKey(user string) string {
	return ev.prefix + ":email->id:" + user
}

func (ev *MSVerifier) getIDToDataKey(user, id string) string {
	return ev.prefix + ":id->data:" + user + ":" + id
}

func (ev *MSVerifier) createID(user string) (string, error) {
	idObj, err := uuid.NewRandom()
	if err != nil {
		return "", err
	}
	uuid := idObj.String()
	return base64.RawStdEncoding.EncodeToString([]byte(user + compSep + uuid)), nil
}

func (ev *MSVerifier) invalidInputErr(str string) error {
	return fmt.Errorf("invalid input \"%v\"", str)
}

func (ev *MSVerifier) getUserFromID(id string) (string, error) {
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
