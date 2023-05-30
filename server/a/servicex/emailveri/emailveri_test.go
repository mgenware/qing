/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package emailveri

import (
	"errors"
	"qing/a/appMS"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
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
	_, id, err := appMS.GetConn().GetStringValue(key)
	if err != nil {
		return "", err
	}
	if id == "" {
		return "", errors.New("Unexpected empty ID")
	}
	return id, nil
}

func mustGetStoreValue(assert *assert.Assertions, key, expected string) {
	_, got, err := appMS.GetConn().GetStringValue(key)
	assert.Nil(err)
	assert.Equal(got, expected)
}

func TestAddAndVerify(t *testing.T) {
	assert := assert.New(t)

	v := NewEmailVerificator(appMS.GetConn(), tPrefix, 3*time.Second)
	_, err := v.Add(tEmail, tData)
	assert.Nil(err)

	id, err := getID(v, tPrefix, tEmail)
	assert.Nil(err)

	// Add should add two value to store.
	mustGetStoreValue(assert, getEmailToIDKey(tPrefix, tEmail), id)
	mustGetStoreValue(assert, getIDToDataKey(tPrefix, tEmail, id), tData)

	_, err = v.Verify(id)
	assert.Nil(err)

	mustGetStoreValue(assert, getEmailToIDKey(tPrefix, tEmail), "")
	mustGetStoreValue(assert, getIDToDataKey(tPrefix, tEmail, id), "")
}

func TestVerifyFailed(t *testing.T) {
	assert := assert.New(t)

	v := NewEmailVerificator(appMS.GetConn(), tPrefix, 3*time.Second)
	_, err := v.Add(tEmail, tData)
	assert.Nil(err)

	id, err := getID(v, tPrefix, tEmail)
	assert.Nil(err)

	_, err = v.Verify("__")
	if err == nil {
		t.Fatal("Expected `Verify` to fail")
	}

	mustGetStoreValue(assert, getEmailToIDKey(tPrefix, tEmail), id)
	mustGetStoreValue(assert, getIDToDataKey(tPrefix, tEmail, id), tData)
}

func TestAddAndTimeout(t *testing.T) {
	assert := assert.New(t)

	v := NewEmailVerificator(appMS.GetConn(), tPrefix, 1*time.Second)
	_, err := v.Add(tEmail, tData)
	assert.Nil(err)

	id, err := getID(v, tPrefix, tEmail)
	assert.Nil(err)

	mustGetStoreValue(assert, getEmailToIDKey(tPrefix, tEmail), id)
	mustGetStoreValue(assert, getIDToDataKey(tPrefix, tEmail, id), tData)

	time.Sleep(1500 * time.Millisecond)
	mustGetStoreValue(assert, getEmailToIDKey(tPrefix, tEmail), "")
	mustGetStoreValue(assert, getIDToDataKey(tPrefix, tEmail, id), "")
}
