export function skipIndex<T>(array: ReadonlyArray<T>, index: number): T[] {
  return array.filter((_, i) => i !== index);
}

export function skipItem<T>(array: ReadonlyArray<T>, item: T): T[] {
  return array.filter((element) => element !== item);
}
