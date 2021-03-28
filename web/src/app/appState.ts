/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { CHECK } from 'checks';

interface AppStateEntry {
  constructorFn?: () => void;
  value?: unknown;
}

type ListenerFn = (name: string, value: unknown) => void;

export class AppState {
  private entries: Record<string, AppStateEntry> = {};
  private listeners: ListenerFn[] = [];

  register(name: string, ctorFn: () => unknown) {
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

  observe<T>(listener: (name: string, value: T) => void): () => void {
    this.listeners.push(listener as ListenerFn);
    return () => {
      this.listeners = this.listeners.filter((fn) => fn !== listener);
    };
  }

  set(name: string, value: unknown) {
    const entry = { name, value };
    this.entries[name] = entry;
    for (const listener of this.listeners) {
      listener(name, value);
    }
  }
}

const appState = new AppState();
export default appState;
