import pupa from 'pupa';

const wind = window as any;
export const ls: { [key: string]: string } = wind.ls;
if (!ls) {
  throw new Error('Localization file is not loaded');
}

export function format(key: string, ...data: any[]): string {
  return pupa(ls[key], data);
}

export default ls;
