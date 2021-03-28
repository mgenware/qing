/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

export type EventEmitterAction = (arg: unknown) => void;

export class EventEmitter {
  private actions: Record<string, EventEmitterAction[]> = {};

  on(name: string, cb: EventEmitterAction): EventEmitterAction {
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

  dispatch(name: string, arg?: unknown): boolean {
    const list = this.actions[name];
    if (!list) {
      return false;
    }
    list.forEach((cb) => cb(arg));
    return true;
  }
}

export class EventEntry<T> {
  private events: EventEmitter;
  constructor(events: EventEmitter, public name: string) {
    this.events = events;
  }

  on(cb: (arg: T) => void) {
    this.events.on(this.name, (arg) => cb(arg as T));
  }

  dispatch(arg: T) {
    this.events.dispatch(this.name, arg);
  }
}
