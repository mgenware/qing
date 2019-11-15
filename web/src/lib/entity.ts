export enum EntityType {
  post = 1,
  cmt,
}

export class Entity {
  constructor(public type: EntityType, public id: string) {}
}
