import * as dd from 'dd-models';

class User extends dd.Table {
  id = dd.pk();
  email = dd.varChar(255).unique;
  name = dd.varChar(255);
  icon = dd.varChar(255);
  url_name = dd.varChar(30).nullable.unique;
  created_time = dd.datetime(true);

  company = dd.varChar(100);
  website = dd.varChar(100);
  location = dd.varChar(100);

  sig = dd.text().nullable;
  sig_src = dd.text().nullable;
}

export default dd.table(User);
