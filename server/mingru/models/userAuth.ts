import * as mm from 'mingru-models';

export class UserAuth extends mm.Table {
  id = mm.pk();
  // 0: password based, non-zero: thirdparty provider.
  auth_type = mm.uSmallInt().default(0);
}

export default mm.table(UserAuth);
