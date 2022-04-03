# SOD (Shared Object Definition)

Use YAML to define types that are shared between TypeScript and Go.

## Predefined import paths

- `:da` DA types
- `:sod:<path>` references other SOD types

## Required or optional

Field names are required by default, use `?` to indicate an optional type. A pointer type is always optional.

NOTE: fields marked with `?` won't result in pointers in Go, the `?` is to force optional attribute in TS, e.g. `string`. Use pointers in YAML if you need to mark it as a pointer.

### Go

Optional fields are generated as pointers.

### TypeScript

Since all fields in Go have `omitifempty` tag. Most TypeScript fields can be optional even not marked as optional. See the exceptions below:

- Pointers in Go: optional due to no pointers in TS,
- Boolean and numeric types: optional due to `omitifempty`
