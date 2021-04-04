package app

// PanicIfErr panics if the given err is not nil.
func PanicIfErr(err error) {
	if err != nil {
		panic(err)
	}
}
