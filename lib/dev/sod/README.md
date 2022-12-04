# SOD (Shared Object Definition)

Use YAML to define shared types between TypeScript and Go.

## Required or optional

By default, field names are required properties in Go, and optional properties in TS due to the auto `omitifempty`. To mark a field optional in Go, use `<type>?`. To mark a field required in TS, use `<type>!`.

### Predefined types

- `:da` DA types, e.g. `:da.CmtResult`
- `:sod` references other SOD types, format `:sod.<filepath>.<TypeName>`, e.g. `:sod.cmt.cmt.Cmt` -> import `Cmt` type from `sod/cmt/cmt.yaml`

### Specify types from other files

Use `__<lang>_imports`:

```yaml
PostWind:
  __ts_imports:
    - "{ Cmt } from '../cmt/cmt.js'"
  __go_imports:
    - 'qing/sod/cmtSod'

  focusedCmt:
    go: cmtSod.Cmt?
    ts: Cmt?
  focusedCmtParent:
    go: cmtSod.Cmt?
    ts: Cmt?
```

### Go

Optional fields are generated as pointers.

### TypeScript

Since all fields in Go have `omitifempty` tag. Most TypeScript fields can be optional even not marked as optional. See the exceptions below:

- Pointers in Go: optional due to no pointers in TS,
- Boolean and numeric types: optional due to `omitifempty`
