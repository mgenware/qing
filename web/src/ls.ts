import pupa from 'pupa';

const wind = window as any;
export const ls: { [key: string]: string } = wind.ls;
export default ls;

export function format(key: string, ...data: any[]): string {
  return pupa(ls[key], data);
}
