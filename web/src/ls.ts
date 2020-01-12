import fmt from 'bowhead-js';
import LSDefs from 'lsDefs';

const wind = window as any;
export const ls: LSDefs = wind.ls;
if (!ls) {
  throw new Error('Localization file is not loaded');
}

export function formatLS(str: string, ...data: any[]): string {
  return fmt(str, ...data);
}

export function getLSByKey(key: string): string {
  return (ls as any)[key];
}

export default ls;
