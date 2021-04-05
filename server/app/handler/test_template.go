/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package handler

import (
	"bytes"
	"encoding/json"
	"io"
)

type TestTemplate struct {
	name string
}

func NewTestTemplate(name string) *TestTemplate {
	return &TestTemplate{name: name}
}

func (tt *TestTemplate) Execute(wr io.Writer, data interface{}) error {
	b, err := json.Marshal(data)
	if err != nil {
		return err
	}
	_, err = wr.Write(b)
	return err
}

func (tt *TestTemplate) ExecuteToString(data interface{}) (string, error) {
	buffer := &bytes.Buffer{}
	err := tt.Execute(buffer, data)
	if err != nil {
		return "", err
	}
	return buffer.String(), nil
}

func (tt *TestTemplate) MustExecute(wr io.Writer, data interface{}) {
	err := tt.Execute(wr, data)
	if err != nil {
		panic(err)
	}
}

func (tt *TestTemplate) MustExecuteToString(data interface{}) string {
	result, err := tt.ExecuteToString(data)
	if err != nil {
		panic(err)
	}
	return result
}
