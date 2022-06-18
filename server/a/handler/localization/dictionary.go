/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

/******************************************************************************************
* This code was automatically generated by go-const-gen.
* Do not edit this file manually, your changes will be overwritten.
******************************************************************************************/

package localization

import (
	"encoding/json"
	"io/ioutil"
)

// Dictionary ...
type Dictionary struct {
	SiteName string `json:"siteName"`
}

// ParseDictionary loads a Dictionary from a JSON file.
func ParseDictionary(file string) (*Dictionary, error) {
	bytes, err := ioutil.ReadFile(file)
	if err != nil {
		return nil, err
	}

	var data Dictionary
	err = json.Unmarshal(bytes, &data)
	if err != nil {
		return nil, err
	}
	return &data, nil
}
