/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

package cfgx

import (
	"encoding/json"
	"fmt"
	"log"
	"path/filepath"
	"qing/a/def/infraDef"
	"qing/lib/iolib"
	"runtime"

	"github.com/imdario/mergo"
	"github.com/xeipuuv/gojsonschema"
)

type ReadConfigCreateDataFn func() ConfigBase

func readConfigCore(absFile string, createFn ReadConfigCreateDataFn) (ConfigBase, error) {
	log.Printf("Loading config at \"%v\"", absFile)
	obj := createFn()

	err := iolib.ReadJSONFile(absFile, obj)
	if err != nil {
		return nil, fmt.Errorf("error reading config file %v: %v", absFile, err)
	}

	extends := obj.GetExtends()
	if extends != "" {
		if filepath.IsAbs(extends) {
			return nil, fmt.Errorf("`extends` cannot be an absolute path, got %v", extends)
		}
		extendsFile := filepath.Join(filepath.Dir(absFile), extends)
		parent, err := readConfigCore(extendsFile, createFn)
		if err != nil {
			return nil, fmt.Errorf("error reading parent file %v: %v", extendsFile, err)
		}
		if err := mergo.Merge(obj, parent); err != nil {
			return nil, fmt.Errorf("error merging parent file %v: %v", extendsFile, err)
		}
	}
	// Ret `extends` to empty.
	obj.SetExtends("")
	return obj, nil
}

// MustReadConfig constructs a config object from the given file.
func MustReadConfig(absFile string, schemaName string, createFn ReadConfigCreateDataFn) ConfigBase {
	if !filepath.IsAbs(absFile) {
		panic(fmt.Errorf("expected an absolute filepath, got %v", absFile))
	}
	conf, err := readConfigCore(absFile, createFn)
	if err != nil {
		panic(fmt.Errorf("error loading config %v: %v", absFile, err))
	}
	mustValidateConfig(conf, schemaName)
	return conf
}

func mustValidateConfig(c ConfigBase, schemaName string) {
	schemaFile := filepath.Join(infraDef.ConfigSchemaDir, schemaName+".json")
	// Validate with JSON schema.
	log.Printf("Validating config against schema \"%v\"", schemaFile)

	schemaFilePath := toFileURI(schemaFile)
	schemaLoader := gojsonschema.NewReferenceLoader(schemaFilePath)
	documentLoader := gojsonschema.NewGoLoader(c)

	result, err := gojsonschema.Validate(schemaLoader, documentLoader)
	if err != nil {
		panic(fmt.Errorf("error validating schema %v: %v", schemaName, err))
	}

	if !result.Valid() {
		fmt.Print("Config file validation error:\n")
		fmt.Print("======= Start of validation errors =======\n")
		for _, desc := range result.Errors() {
			fmt.Printf("- %s\n", desc)
		}
		fmt.Print("======= End of validation errors =======\n")

		fmt.Print("======= Start of config content =======\n")

		configJSON, err := json.MarshalIndent(c, "", "  ")
		if err != nil {
			configJSON = []byte(fmt.Sprintf("Failed to marshal config to JSON: %v", err))
		}
		fmt.Printf("%v\n", string(configJSON))
		fmt.Print("======= End of config content =======\n")
		panic(fmt.Errorf("config file validation failed"))
	}
}

func toFileURI(path string) string {
	prefix := "file://"
	if runtime.GOOS == "windows" {
		prefix += "/"
	}
	return prefix + path
}
