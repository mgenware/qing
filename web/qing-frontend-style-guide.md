# Qing Frontend Style Guide

## `.ts` file naming convention

Use camelCase for `.ts` files.

## Bottom margin in block elements

DO NOT add bottom margin to block elements unless you are certain there will be siblings after the element.

## Getting DOM elements in templates

Use a getter to return the element with a nullable return type, this is because an element in templates may be null in some cases (for example, when an element is defined in an `if-else` branch):

```ts
private get textElement(): HTMLInputElement|null {
  return this.document.getElementById('inputElement');
}
```

If the element is required, use `BaseElement.mustGetShadowElement`:

```ts
private get textElement(): HTMLInputElement {
  return this.mustGetShadowElement('inputElement');
}
```

## `firstUpdated` in child components

P: parent component, C: child component.

```
P - render
P - firstUpdated
P - updated
C - render
C - firstUpdated
C - updated
```

When P changes a property in `firstUpdate`:

```
P - render
P - firstUpdated
P - updated
C - render
C - firstUpdated
C - updated
P - render (new value)
P - updated (new value)
C - render (new value)
C - updated (new value)
```
