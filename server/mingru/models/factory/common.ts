import * as mm from 'mingru-models';

export interface TableWithID extends mm.Table {
  id: mm.Column;
}

export interface TableWithUserID extends TableWithID {
  user_id: mm.Column;
}
