import Trie from 'basic-trie';

type MiniURLRouterHandler = (args: Readonly<Record<string, unknown>>) => void;

export class MiniURLRouter {
  #trie = new Trie<string, MiniURLRouterHandler>();

  register(path: string, handler: MiniURLRouterHandler) {
    const parts = this.checkPath(path, true);
    this.#trie.set(parts, handler);
  }

  handle(urlString: string): boolean {
    const url = new URL(urlString);
    const path = url.pathname;
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
}
