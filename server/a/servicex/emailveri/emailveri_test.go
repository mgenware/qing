/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package emailveri

import (
	"errors"
	"qing/a/app"
	"qing/a/appMS"
	"testing"
	"time"

	"github.com/mgenware/goutil/test"
)

var (
	tEmail  = "mgen@_.com"
	tPrefix = "__emailveri-test"
	tData   = "asd"
)

func getEmailToIDKey(prefix, email string) string {
	return prefix + ":email-to-id:" + email
}

func getIDToDataKey(prefix, email, id string) string {
	return prefix + ":id-to-data:" + email + ":" + id
}

func getID(v *EmailVerificator, prefix, email string) (string, error) {
	key := getEmailToIDKey(prefix, email)
	id, err := appMS.GetConn().GetStringValue(key)
	if err != nil {
		return "", err
	}
	if id == "" {
		return "", errors.New("Unexpected empty ID")
	}
	return id, nil
}

func mustGetStoreValue(t *testing.T, key, expected string) {
	got, err := appMS.GetConn().GetStringValue(key)
	app.FatalOn(err, t)
	test.Assert(t, got, expected)
}

func TestAddAndVerify(t *testing.T) {
	v := NewEmailVerificator(appMS.GetConn(), tPrefix, 3*time.Second)
	_, err := v.Add(tEmail, tData)
	app.FatalOn(err, t)

	id, err := getID(v, tPrefix, tEmail)
	app.FatalOn(err, t)

	// Add should add two value to store.
	mustGetStoreValue(t, getEmailToIDKey(tPrefix, tEmail), id)
	mustGetStoreValue(t, getIDToDataKey(tPrefix, tEmail, id), tData)

	_, err = v.Verify(id)
	app.FatalOn(err, t)

	mustGetStoreValue(t, getEmailToIDKey(tPrefix, tEmail), "")
	mustGetStoreValue(t, getIDToDataKey(tPrefix, tEmail, id), "")
}

func TestVerifyFailed(t *testing.T) {
	v := NewEmailVerificator(appMS.GetConn(), tPrefix, 3*time.Second)
	_, err := v.Add(tEmail, tData)
	app.FatalOn(err, t)

	id, err := getID(v, tPrefix, tEmail)
	app.FatalOn(err, t)

	_, err = v.Verify("__")
	if err == nil {
		t.Fatal("Expected `Verify` to fail")
	}

	mustGetStoreValue(t, getEmailToIDKey(tPrefix, tEmail), id)
	mustGetStoreValue(t, getIDToDataKey(tPrefix, tEmail, id), tData)
}

func TestAddAndTimeout(t *testing.T) {
	v := NewEmailVerificator(appMS.GetConn(), tPrefix, 1*time.Second)
	_, err := v.Add(tEmail, tData)
	app.FatalOn(err, t)

	id, err := getID(v, tPrefix, tEmail)
	app.FatalOn(err, t)

	mustGetStoreValue(t, getEmailToIDKey(tPrefix, tEmail), id)
	mustGetStoreValue(t, getIDToDataKey(tPrefix, tEmail, id), tData)

	time.Sleep(1500 * time.Millisecond)
	mustGetStoreValue(t, getEmailToIDKey(tPrefix, tEmail), "")
	mustGetStoreValue(t, getIDToDataKey(tPrefix, tEmail, id), "")
}
