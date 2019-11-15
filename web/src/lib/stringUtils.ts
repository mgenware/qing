export function capitalizeFirstLetter(s: string): string {
  if (!s) {
    return s;
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function splitLocalizedString(s: string): string[] {
  return s.split('||');
}
