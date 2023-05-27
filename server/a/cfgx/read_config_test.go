/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package cfgx

import (
	"qing/lib/iolib"
	"testing"

	"github.com/stretchr/testify/assert"
)

func mustCloneToMap(cb ConfigBase) map[string]any {
	c := cb.(*CoreConfig)
	copied, err := c.CloneConfig()
	if err != nil {
		panic(err)
	}
	dict, err := iolib.StructToJSONMap(copied)
	if err != nil {
		panic(err)
	}
	return dict
}

func createCoreConfigFn() ConfigBase {
	return &CoreConfig{}
}

func TestReadConfigCoreLevel1(t *testing.T) {
	assert := assert.New(t)

	cfg, err := readConfigCore("test_files/a.json", createCoreConfigFn)
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
	assert.Equal(map[string]any{
		"z_test": map[string]any{
			"a": float64(1),
			"b": float64(2),
		},
	}, mustCloneToMap(cfg))
}

func TestReadConfigCoreLevel2(t *testing.T) {
	assert := assert.New(t)

	cfg, err := readConfigCore("test_files/b.json", createCoreConfigFn)
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
	assert.Equal(map[string]any{
		"z_test": map[string]any{
			"a": float64(1),
			"b": float64(-1),
			"c": float64(3),
		},
	}, mustCloneToMap(cfg))
}

func TestReadConfigCoreLevel3(t *testing.T) {
	assert := assert.New(t)

	cfg, err := readConfigCore("test_files/c.json", createCoreConfigFn)
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
	assert.Equal(map[string]any{
		"z_test": map[string]any{
			"a": float64(1),
			"b": float64(-1),
			"c": float64(3),
		},
	}, mustCloneToMap(cfg))
}
