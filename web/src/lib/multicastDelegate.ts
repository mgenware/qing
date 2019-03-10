export default class MulticastDelegate<T> {
  private callbacks: Array<(sender: T) => void>;

  constructor() {
    this.callbacks = [];
  }

  add(callback: (sender: T) => void) {
    this.callbacks.push(callback);
  }

  invoke(sender: T) {
    for (const cb of this.callbacks) {
      cb(sender);
    }
  }
}
