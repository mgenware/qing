# ESM imports

## Compatibility with ESM imports

Qing runs on node ESM mode but Qing web source code is not strictly written in ESM for the following features we are using.

### TypeScript base URL

Qing is heavily relying on TypeScript base URL feature, which enables us to reference other files from a root directory:

```ts
// With TypeScript base URL.
import 'ui/view';
// Imports don't need to be updated when current file is moved.

// Without TypeScript base URL.
import '../../../ui/view';
// Imports NEED to be updated when current file is moved.
```

### Auto extension resolution

Import path extensions are omitted in Qing.

```ts
import 'ui/view'; // No `.js` extension needed.
```

## Run source on ESM mode

So how can we run Qing on node ESM with code that is not compatible with ESM syntax? We have two approaches to tackle this:

- Use esbuild for main app bundle, which handles this issue perfectly.
- Use a so-called turbo mode to handle other cases.

### Turbo mode

Turbo mode works by using [ts-transform-esm-import](https://github.com/mgenware/ts-transform-esm-import) to transform TypeScript imports into valid ESM imports. Turbo mode is used primarily in unit tests and integration tests.
