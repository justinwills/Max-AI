/* Lightweight localStorage helpers for consistent, safe access */
(function (window) {
  // In-memory fallback if both localStorage and sessionStorage are unavailable
  const mem = Object.create(null);

  function tryGet(storage, key) {
    try { return storage.getItem(key); } catch { return null; }
  }
  function trySet(storage, key, value) {
    try { storage.setItem(key, value); return true; } catch { return false; }
  }
  function tryRemove(storage, key) {
    try { storage.removeItem(key); return true; } catch { return false; }
  }

  const StorageUtil = {
    get(key) {
      // Prefer localStorage, then sessionStorage, then memory
      const vLocal = tryGet(window.localStorage, key);
      if (vLocal != null && vLocal !== "") return vLocal;
      const vSession = tryGet(window.sessionStorage, key);
      if (vSession != null && vSession !== "") return vSession;
      return Object.prototype.hasOwnProperty.call(mem, key) ? mem[key] : null;
    },

    set(key, value) {
      const str = String(value);
      if (!trySet(window.localStorage, key, str)) {
        if (!trySet(window.sessionStorage, key, str)) {
          mem[key] = str;
        }
      }
    },

    remove(key) {
      const okLocal = tryRemove(window.localStorage, key);
      const okSession = tryRemove(window.sessionStorage, key);
      if (Object.prototype.hasOwnProperty.call(mem, key)) delete mem[key];
      return okLocal || okSession;
    },

    getJSON(key, fallback = null) {
      try {
        const raw = this.get(key);
        if (raw == null || raw === "") return fallback;
        const parsed = JSON.parse(raw);
        return parsed == null ? fallback : parsed;
      } catch { return fallback; }
    },

    setJSON(key, value) {
      const str = JSON.stringify(value);
      if (!trySet(window.localStorage, key, str)) {
        if (!trySet(window.sessionStorage, key, str)) {
          mem[key] = str;
        }
      }
    },

    getInt(key, fallback = 0) {
      try {
        const raw = this.get(key);
        const n = parseInt(raw || "", 10);
        return Number.isFinite(n) ? n : fallback;
      } catch { return fallback; }
    },

    setInt(key, value) {
      this.set(key, String(Math.floor(value || 0)));
    },

    incInt(key, by = 1) {
      const cur = this.getInt(key, 0) + (Number.isFinite(by) ? by : 1);
      this.setInt(key, cur);
      return cur;
    },

    onStorageKeys(keys, handler) {
      if (!Array.isArray(keys) || typeof handler !== "function") return;
      window.addEventListener("storage", (e) => {
        if (!e.key) return;
        if (keys.includes(e.key)) handler(e);
      });
    },
  };

  window.StorageUtil = StorageUtil;
})(window);
