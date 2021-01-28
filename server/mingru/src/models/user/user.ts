import * as mm from 'mingru-models';
import {
  maxEmailLen,
  maxNameLen,
  maxFileNameLen,
  maxUserStatusLen,
  maxUserInfoFieldLen,
  maxURLLen,
} from '../../constants.json';

export class User extends mm.Table {
  id = mm.pk();
  email = mm.varChar(maxEmailLen).uniqueConstraint;
  name = mm.varChar(maxNameLen);
  icon_name = mm.varChar(maxFileNameLen).default('');
  created_at = mm.datetime('utc');
  status = mm.varChar(maxUserStatusLen).default('');

  company = mm.varChar(maxUserInfoFieldLen).default('');
  website = mm.varChar(maxURLLen).default('');
  location = mm.varChar(maxUserInfoFieldLen).default('');
  bio = mm.text().nullable.default(null);

  admin = mm.bool().default(false);
}

export default mm.table(User);
