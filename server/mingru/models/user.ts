import * as mm from 'mingru-models';

export class User extends mm.Table {
  id = mm.pk();
  email = mm.varChar(255).unique;
  name = mm.varChar(255);
  icon_name = mm.varChar(255).default('');
  created_time = mm.datetime('utc');

  company = mm.varChar(100).default('');
  website = mm.varChar(100).default('');
  location = mm.varChar(100).default('');

  bio = mm.text().nullable.default(null);
}

export default mm.table(User);
