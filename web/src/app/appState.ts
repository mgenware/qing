/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { CHECK } from 'checks.js';
import { EventEmitter, CancelEventFunc } from 'mahur';

interface AppStateEntry {
  constructorFn?: () => void;
  value?: unknown;
}

export class AppState {
  private entries: Record<string, AppStateEntry> = {};
  private listeners = new EventEmitter();

  register<T = void>(name: string, ctorFn: () => T) {
    CHECK(!this.entries[name]);
    this.entries[name] = {
      constructorFn: ctorFn,
    };
  }

  get<T>(name: string): T {
    const entry = this.entries[name];
    CHECK(entry);
    if (entry.constructorFn) {
      // Initialize the entry.
      entry.value = entry.constructorFn();
      entry.constructorFn = undefined;
    }
    return entry.value as T;
  }

  observe(name: string, handler: (arg: unknown) => void): CancelEventFunc {
    return this.listeners.on(name, handler);
  }

  set(name: string, value: unknown) {
    const entry = { name, value };
    this.entries[name] = entry;
    this.listeners.dispatch(name, value);
  }
}

const appState = new AppState();
export default appState;
