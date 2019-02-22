// Inject language files in dev mode
// tslink:disable-next-line
const en = require('../../i18n/langs/en.json');
(window as any).ls = en;
import './main';
