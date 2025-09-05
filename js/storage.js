/* Lightweight localStorage helpers for consistent, safe access */
(function (window) {
  const StorageUtil = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch { return null; }
    },

    set(key, value) {
      try { window.localStorage.setItem(key, String(value)); } catch {}
    },

    getJSON(key, fallback = null) {
      try {
        const raw = window.localStorage.getItem(key);
        if (raw == null || raw === "") return fallback;
        const parsed = JSON.parse(raw);
        return parsed == null ? fallback : parsed;
      } catch { return fallback; }
    },

    setJSON(key, value) {
      try { window.localStorage.setItem(key, JSON.stringify(value)); } catch {}
    },

    getInt(key, fallback = 0) {
      try {
        const n = parseInt(window.localStorage.getItem(key) || "", 10);
        return Number.isFinite(n) ? n : fallback;
      } catch { return fallback; }
    },

    setInt(key, value) {
      try { window.localStorage.setItem(key, String(Math.floor(value || 0))); } catch {}
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

