export class Storage {
  static get(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static remove(key) {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }

  static getSession(key) {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  static setSession(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  static removeSession(key) {
    sessionStorage.removeItem(key);
  }
}
