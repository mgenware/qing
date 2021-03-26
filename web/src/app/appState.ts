/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import { CHECK } from 'checks';
import { AppStateName } from './appStateName';

interface AppStateEntry {
  constructorFn?: () => void;
  value?: unknown;
}

type ListenerFn = (name: AppStateName, value: unknown) => void;

export class AppState {
  private entries: Record<string, AppStateEntry> = {};
  private listeners: ListenerFn[] = [];

  register(name: AppStateName, ctorFn: () => unknown) {
    CHECK(!this.entries[name]);
    this.entries[name] = {
      constructorFn: ctorFn,
    };
  }

  get<T>(name: AppStateName): T {
    const entry = this.entries[name];
    CHECK(entry);
    if (entry.constructorFn) {
      // Initialize the entry.
      entry.value = entry.constructorFn();
      entry.constructorFn = undefined;
    }
    return entry.value as T;
  }

  observe<T>(listener: (name: AppStateName, value: T) => void): () => void {
    this.listeners.push(listener as ListenerFn);
    return () => {
      this.listeners = this.listeners.filter((fn) => fn !== listener);
    };
  }

  set(name: AppStateName, value: unknown) {
    const entry = this.entries[name];
    // Entry must exist.
    CHECK(entry);
    // Entry must be initialized.
    CHECK(!entry.constructorFn);
    entry.value = value;
    for (const listener of this.listeners) {
      listener(name, value);
    }
  }
}

const appState = new AppState();
export default appState;
