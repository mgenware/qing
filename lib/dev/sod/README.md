# SOD (Shared Object Definition)

Use YAML to define shared types between TypeScript and Go.

## Predefined import paths

- `:da` DA types
- `:sod:<path>` references other SOD types

## Required or optional

By default, field names are required properties in Go, and optional properties in TS due to the auto `omitifempty`. To mark a field optional in Go, use `<type>?`. To mark a field required in TS, use `<type>!`.

### Go

Optional fields are generated as pointers.

### TypeScript

Since all fields in Go have `omitifempty` tag. Most TypeScript fields can be optional even not marked as optional. See the exceptions below:

- Pointers in Go: optional due to no pointers in TS,
- Boolean and numeric types: optional due to `omitifempty`
