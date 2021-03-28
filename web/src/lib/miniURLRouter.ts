/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import appDevMode from 'app/appDevMode';
import Trie, { PayloadType } from 'basic-trie';

export type MiniURLRouterHandler = (args: Readonly<Record<string, unknown>>) => void;

class URLComponentTrie extends Trie<string, MiniURLRouterHandler> {
  isKeyWildcard(key: string): boolean {
    return key.startsWith(':');
  }

  getWildcardPayload(
    key: string,
    wildcardName: string,
    _wildcardValue: MiniURLRouterHandler | null,
  ): PayloadType | undefined {
    return {
      [wildcardName.substr(1)]: key,
    };
  }
}

export class MiniURLRouter {
  #trie = new URLComponentTrie();

  register(path: string, handler: MiniURLRouterHandler) {
    this.log(`Registered route "${path}"`);
    const parts = this.checkPath(path, true);
    this.#trie.set(parts, handler);
  }

  handle(urlString: string): boolean {
    const url = new URL(urlString);
    const path = url.pathname;
    this.log(`Handling path "${path}"`);
    if (!path) {
      return false;
    }
    const parts = this.checkPath(path, false);
    if (!parts.length) {
      return false;
    }
    const [fn, payload] = this.#trie.getWithPayload(parts);
    if (fn) {
      fn(payload || {});
      return true;
    }
    return false;
  }

  startOnce(): boolean {
    return this.handle(window.location.href);
  }

  private checkPath(path: string, throws: boolean): string[] {
    if (!path?.startsWith('/')) {
      if (throws) {
        throw new Error(`Path must start with /, got "${path}"`);
      } else {
        return [];
      }
    }
    const parts = path.substr(1).split('/');
    if (parts.length < 1) {
      if (throws) {
        throw new Error('/ is not supported');
      } else {
        return [];
      }
    }
    return parts;
  }

  private log(s: string) {
    if (appDevMode()) {
      // eslint-disable-next-line no-console
      console.log(`🚃 ${s}`);
    }
  }
}
