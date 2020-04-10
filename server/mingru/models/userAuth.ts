import * as mm from 'mingru-models';

export enum UserAuthType {
  pwd = 1,
}

export class UserAuth extends mm.Table {
  // ID is from `user.id`.
  id = mm.pk().noAutoIncrement;
  // 0: password based, non-zero: thirdparty provider.
  auth_type = mm.uSmallInt().default(0);
}

export default mm.table(UserAuth);
