package localization

import (
	"encoding/json"
	"io/ioutil"
)

type Dictionary struct {
	Map map[string]string
}

func NewDictionaryFromFile(file string) (*Dictionary, error) {
	m, err := readJSONFileToMap(file)
	if err != nil {
		return nil, err
	}
	return &Dictionary{Map: m}, nil
}

func readJSONFileToMap(file string) (map[string]string, error) {
	bytes, err := ioutil.ReadFile(file)
	if err != nil {
		return nil, err
	}

	dic := make(map[string]string)
	err = json.Unmarshal(bytes, &dic)
	if err != nil {
		return nil, err
	}

	return dic, nil
}
