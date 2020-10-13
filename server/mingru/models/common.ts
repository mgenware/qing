import * as mm from 'mingru-models';

const intType: mm.SQLVariableType = { name: 'int', defaultValue: 0 };
export const sanitizedStub = new mm.SQLVariable(intType, 'sanitizedStub');
export const captStub = new mm.SQLVariable(intType, 'captStub');

export interface TableWithID extends mm.Table {
  id: mm.Column;
}

export interface TableWithUserID extends TableWithID {
  user_id: mm.Column;
}
