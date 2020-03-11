export function removeByIndex<T>(array: T[], index: number) {
  array.splice(index, 1);
}

export function removeByIndexReadOnly<T>(
  array: ReadonlyArray<T>,
  index: number,
): T[] {
  return array.filter((_, i) => i !== index);
}
