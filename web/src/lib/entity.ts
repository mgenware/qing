export enum EntityType {
  post = 1,
}

export class Entity {
  constructor(public type: EntityType, public id: string) {}
}
