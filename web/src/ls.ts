import pupa from 'pupa';
import Vue from 'vue';

const wind = window as any;
export const ls: { [key: string]: string } = wind.ls;
if (!ls) {
  throw new Error('Localization file is not loaded');
}
Vue.prototype.$ls = ls;

export function format(key: string, ...data: any[]): string {
  return pupa(ls[key], data);
}

export default ls;
