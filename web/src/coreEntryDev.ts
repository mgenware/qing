/* eslint-disable @typescript-eslint/no-explicit-any */
// Inject language files in dev mode
import en from '../langs/en.json';

(window as any).ls = en;
(window as any).__qing_dev__ = true;

// eslint-disable-next-line import/first
import './coreEntry';
