export type EventEmitterAction = (arg: unknown) => void;

export class EventEmitter {
  private actions: Record<string, EventEmitterAction[]> = {};

  addListener(name: string, cb: EventEmitterAction): EventEmitterAction {
    const { actions } = this;
    if (!actions[name]) {
      actions[name] = [];
    }
    this.actions[name]?.push(cb);

    return () => {
      const list = this.actions[name];
      if (!list) {
        return;
      }
      const idx = list.indexOf(cb);
      if (idx >= 0) {
        list.splice(idx, 1);
      }
    };
  }

  emit(name: string, arg?: unknown): boolean {
    const list = this.actions[name];
    if (!list) {
      return false;
    }
    list.forEach((cb) => cb(arg));
    return true;
  }
}
