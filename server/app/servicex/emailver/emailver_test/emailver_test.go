package emailver_test

import (
	"qing/app/servicex/emailver"
	"qing/tools/testx"
	"testing"
	"time"

	"github.com/mgenware/go-packagex/v5/test"
)

var (
	tEmail  = "mgen@_.com"
	tPrefix = "emailver-test"
	tData   = "asd"
	tConn   = testx.Redis
)

func getEmailToIDKey(prefix, email string) string {
	return prefix + ":email-to-id:" + email
}

func getIDToDataKey(prefix, email, id string) string {
	return prefix + ":id-to-data:" + email + ":" + id
}

func mustGetID(v *emailver.EmailVerificator, prefix, email string) string {
	key := getEmailToIDKey(prefix, email)
	id, err := tConn.GetStringValueOrDefault(key)
	test.PanicIfErr(err)
	if id == "" {
		panic("Unexpected empty ID")
	}
	return id
}

func mustGetStoreValue(t *testing.T, key, expected string) {
	got, err := tConn.GetStringValueOrDefault(key)
	if err != nil {
		panic(err)
	}
	test.Assert(t, got, expected)
}

func TestAddAndVerify(t *testing.T) {
	v := emailver.NewEmailVerificator(tConn, tPrefix, 3)
	v.Add(tEmail, tData)

	id := mustGetID(v, tPrefix, tEmail)

	// Add should add two value to store.
	mustGetStoreValue(t, getEmailToIDKey(tPrefix, tEmail), id)
	mustGetStoreValue(t, getIDToDataKey(tPrefix, tEmail, id), tData)

	v.Verify(id)
	mustGetStoreValue(t, getEmailToIDKey(tPrefix, tEmail), "")
	mustGetStoreValue(t, getIDToDataKey(tPrefix, tEmail, id), "")
}

func TestVerifyFailed(t *testing.T) {
	v := emailver.NewEmailVerificator(tConn, tPrefix, 3)
	v.Add(tEmail, tData)

	id := mustGetID(v, tPrefix, tEmail)

	v.Verify("__")
	mustGetStoreValue(t, getEmailToIDKey(tPrefix, tEmail), id)
	mustGetStoreValue(t, getIDToDataKey(tPrefix, tEmail, id), tData)
}

func TestAddAndTimeout(t *testing.T) {
	v := emailver.NewEmailVerificator(tConn, tPrefix, 1)
	v.Add(tEmail, tData)

	id := mustGetID(v, tPrefix, tEmail)

	mustGetStoreValue(t, getEmailToIDKey(tPrefix, tEmail), id)
	mustGetStoreValue(t, getIDToDataKey(tPrefix, tEmail, id), tData)

	time.Sleep(1500 * time.Millisecond)
	mustGetStoreValue(t, getEmailToIDKey(tPrefix, tEmail), "")
	mustGetStoreValue(t, getIDToDataKey(tPrefix, tEmail, id), "")
}
