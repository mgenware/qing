import * as mm from 'mingru-models';
import { maxNameLen } from '../../constants.json';

export default class ForumBase extends mm.Table {
  id = mm.pk();
  name = mm.varChar(maxNameLen);
  desc = mm.text().setModelName('DescHTML');
  order_index = mm.uInt().default(0);

  created_at = mm.datetime('utc');
}
