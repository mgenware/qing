import * as mm from 'mingru-models';

export class User extends mm.Table {
  id = mm.pk();
  email = mm.varChar(255).unique;
  name = mm.varChar(255);
  icon_name = mm.varChar(255);
  url_name = mm.varChar(30).nullable.unique;
  created_time = mm.datetime('utc');

  company = mm.varChar(100);
  website = mm.varChar(100);
  location = mm.varChar(100);

  bio = mm.text().nullable;
  postCount = mm.uInt(0);
}

export default mm.table(User);
