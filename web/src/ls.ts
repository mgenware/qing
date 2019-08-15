import fmt from 'bowhead-js';

const wind = window as any;
export const ls: { [key: string]: string } = wind.ls;
if (!ls) {
  throw new Error('Localization file is not loaded');
}

export function format(key: string, ...data: any[]): string {
  return fmt(ls[key], ...data);
}

export default ls;
