/* eslint-disable import/first */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Inject language files in dev mode
import en from '../langs/en.json';

(window as any).ls = en;
(window as any).__qing_dev__ = true;

import './coreEntry';
import './ui/debug/viewsDemo';
