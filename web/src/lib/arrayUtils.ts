export function skipIndex<T>(array: ReadonlyArray<T>, index: number): T[] {
  return array.filter((_, i) => i !== index);
}
