import * as dd from 'dd-models';
import user from './user';

export class UserPost extends dd.Table {
  id = dd.pk();
  title = dd.varChar(255);
  content = dd.text();
  user_id = user.id;

  created_at = dd.datetime(true);
  modified_at = dd.datetime(true);
  like_value = dd.int();
  cmt_count = dd.uInt();

  name = dd.varChar(255);
  icon_name = dd.varChar(255);
  url_name = dd.varChar(30).nullable.unique;
  created_time = dd.datetime(true);

  company = dd.varChar(100);
  website = dd.varChar(100);
  location = dd.varChar(100);

  bio = dd.text().nullable;
  bio_src = dd.text().nullable;
}

export default dd.table(UserPost);
