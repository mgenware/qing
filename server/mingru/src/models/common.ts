import * as mm from 'mingru-models';

const intType: mm.SQLVariableType = { type: 'int', defaultValue: 0 };
export const sanitizedStub = new mm.SQLVariable(intType, 'sanitizedStub');
export const captStub = new mm.SQLVariable(intType, 'captStub');

export interface TableWithID extends mm.Table {
  id: mm.Column;
}

export interface TableWithUserID extends mm.Table {
  user_id: mm.Column;
}

export interface TableWithIDAndUserID extends TableWithID, TableWithUserID {}

export interface TableWithTimestamp extends mm.Table {
  created_at: mm.Column;
  modified_at: mm.Column;
}

export interface BaseEntityTableWithID extends TableWithIDAndUserID, TableWithTimestamp {}

export interface BaseEntityTableWithIDAndTitle extends BaseEntityTableWithID {
  title: mm.Column;
}
