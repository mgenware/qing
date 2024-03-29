/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package msveri

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

func getID(v *MSVerifier, prefix, email string) (string, error) {
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

func TestSetAndVerify(t *testing.T) {
	assert := assert.New(t)

	v := NewMSVerifier(appMS.GetConn(), tPrefix, 3*time.Second)
	_, err := v.Set(tEmail, tData)
	assert.Nil(err)

	id, err := getID(v, tPrefix, tEmail)
	assert.Nil(err)

	// Set should add two value to store.
	mustGetStoreValue(assert, getEmailToIDKey(tPrefix, tEmail), id)
	mustGetStoreValue(assert, getIDToDataKey(tPrefix, tEmail, id), tData)

	actualData, err := v.Verify(id)
	assert.Nil(err)
	assert.Equal(actualData, tData)

	mustGetStoreValue(assert, getEmailToIDKey(tPrefix, tEmail), "")
	mustGetStoreValue(assert, getIDToDataKey(tPrefix, tEmail, id), "")
}

func TestSetAndPeak(t *testing.T) {
	assert := assert.New(t)

	v := NewMSVerifier(appMS.GetConn(), tPrefix, 3*time.Second)
	_, err := v.Set(tEmail, tData)
	assert.Nil(err)

	id, err := getID(v, tPrefix, tEmail)
	assert.Nil(err)

	// Set should add two value to store.
	mustGetStoreValue(assert, getEmailToIDKey(tPrefix, tEmail), id)
	mustGetStoreValue(assert, getIDToDataKey(tPrefix, tEmail, id), tData)

	actualData, err := v.Peak(id)
	assert.Nil(err)
	assert.Equal(actualData, tData)

	// Peak should not remove the value.
	mustGetStoreValue(assert, getEmailToIDKey(tPrefix, tEmail), id)
	mustGetStoreValue(assert, getIDToDataKey(tPrefix, tEmail, id), tData)
}

func TestVerifyFailed(t *testing.T) {
	assert := assert.New(t)

	v := NewMSVerifier(appMS.GetConn(), tPrefix, 3*time.Second)
	_, err := v.Set(tEmail, tData)
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

func TestSetAndTimeout(t *testing.T) {
	assert := assert.New(t)

	v := NewMSVerifier(appMS.GetConn(), tPrefix, 1*time.Second)
	_, err := v.Set(tEmail, tData)
	assert.Nil(err)

	id, err := getID(v, tPrefix, tEmail)
	assert.Nil(err)

	mustGetStoreValue(assert, getEmailToIDKey(tPrefix, tEmail), id)
	mustGetStoreValue(assert, getIDToDataKey(tPrefix, tEmail, id), tData)

	time.Sleep(1500 * time.Millisecond)
	mustGetStoreValue(assert, getEmailToIDKey(tPrefix, tEmail), "")
	mustGetStoreValue(assert, getIDToDataKey(tPrefix, tEmail, id), "")
}
