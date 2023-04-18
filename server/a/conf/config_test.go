/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package conf

import (
	"qing/lib/iolib"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestReadConfigCoreLevel1(t *testing.T) {
	assert := assert.New(t)

	cfg, err := readConfigCore("test_files/a.json")
	if err != nil {
		t.Fatal(err)
	}

	m, err := iolib.StructToJSONMap(cfg)
	if err != nil {
		t.Fatal(err)
	}
	assert.Equal(map[string]any{
		"z_test": map[string]any{
			"a": float64(1),
			"b": float64(2),
		},
	}, m)
}

func TestReadConfigCoreLevel2(t *testing.T) {
	assert := assert.New(t)

	cfg, err := readConfigCore("test_files/b.json")
	if err != nil {
		t.Fatal(err)
	}

	m, err := iolib.StructToJSONMap(cfg)
	if err != nil {
		t.Fatal(err)
	}
	assert.Equal(map[string]any{
		"z_test": map[string]any{
			"a": float64(1),
			"b": float64(-1),
			"c": float64(3),
		},
	}, m)
}

func TestReadConfigCoreLevel3(t *testing.T) {
	assert := assert.New(t)

	cfg, err := readConfigCore("test_files/c.json")
	if err != nil {
		t.Fatal(err)
	}

	m, err := iolib.StructToJSONMap(cfg)
	if err != nil {
		t.Fatal(err)
	}
	assert.Equal(map[string]any{
		"z_test": map[string]any{
			"a": float64(1),
			"b": float64(-1),
			"c": float64(3),
		},
	}, m)
}
