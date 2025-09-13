(function (window) {
  // In-memory fallback if storage APIs throw (e.g., Firefox privacy settings)
  const mem = Object.create(null);

  // Cross-file (file://) fallback via window.name (persists in same tab)
  const NAME_DELIM = "|||MAXAI|||";
  function nameLoad() {
    try {
      const raw = String(window.name || "");
      const idx = raw.lastIndexOf(NAME_DELIM);
      if (idx >= 0) {
        const payload = raw.slice(idx + NAME_DELIM.length);
        if (payload) {
          const obj = JSON.parse(payload);
          if (obj && typeof obj === "object") return obj;
        }
      }
    } catch {}
    return {};
  }
  function nameSave(map) {
    try {
      const raw = String(window.name || "");
      const idx = raw.lastIndexOf(NAME_DELIM);
      const prefix = idx >= 0 ? raw.slice(0, idx) : raw;
      window.name = prefix + NAME_DELIM + JSON.stringify(map || {});
    } catch {}
  }
  function nameGet(key) {
    try { const m = nameLoad(); return Object.prototype.hasOwnProperty.call(m, key) ? m[key] : null; } catch { return null; }
  }
  function nameSet(key, value) {
    try { const m = nameLoad(); m[key] = String(value); nameSave(m); } catch {}
  }
  function nameRemove(key) {
    try { const m = nameLoad(); if (Object.prototype.hasOwnProperty.call(m, key)) { delete m[key]; nameSave(m); } } catch {}
  }
  function nameClear() {
    try { nameSave({}); } catch {}
  }

  function getLS() {
    try { return window.localStorage; } catch { return null; }
  }
  function getSS() {
    try { return window.sessionStorage; } catch { return null; }
  }

  // Hardening: wrap native Storage methods to never throw and fall back to session/memory
  try {
    const SP = window.Storage && window.Storage.prototype;
    if (SP && typeof SP.getItem === "function") {
      const _get = SP.getItem;
      const _set = SP.setItem;
      const _remove = SP.removeItem;
      const _key = SP.key;
      const _clear = SP.clear;
      const LSRef = getLS();
      const SSRef = getSS();

      function mirrorGuestKey(key, value) {
        // Disabled: mirroring user-scoped keys into guest leaked progress
        // across accounts. Keeping as no-op for backward compatibility.
        return;
      }

      SP.getItem = function (key) {
        try {
          const v = _get.call(this, key);
          if (v != null && v !== "") return v;
        } catch (_) {}
        // If reading from localStorage failed or returned empty, try sessionStorage
        try {
          if (LSRef && this === LSRef && SSRef) {
            const alt = SSRef.getItem(key);
            if (alt != null && alt !== "") return alt;
          }
        } catch (_) {}
        // Finally, try window.name store
        const nv = nameGet(key);
        if (nv != null && nv !== "") return nv;
        return Object.prototype.hasOwnProperty.call(mem, key) ? mem[key] : null;
      };

      SP.setItem = function (key, value) {
        try {
          _set.call(this, key, value);
          // Mirror to window.name so other file:// pages in the same tab can read it
          nameSet(key, value);
        } catch (_) {
          // If writing to localStorage fails, try sessionStorage before memory
          try {
            if (LSRef && this === LSRef && SSRef) {
              SSRef.setItem(key, value);
              nameSet(key, value);
              return;
            }
          } catch (_) {}
          nameSet(key, value);
          mem[key] = String(value);
        }
      };

      SP.removeItem = function (key) {
        try {
          _remove.call(this, key);
        } catch (_) {
          if (Object.prototype.hasOwnProperty.call(mem, key)) delete mem[key];
          // Also try removing from sessionStorage mirror if applicable
          try { if (LSRef && this === LSRef && SSRef) SSRef.removeItem(key); } catch(_) {}
        }
        // Always remove from name store
        try { nameRemove(key); } catch(_) {}
        // Remove guest mirror for scoped keys
        try {
          if (typeof key === 'string') {
            const idx = key.indexOf('::');
            if (idx > 0) {
              const gKey = key.slice(0, idx) + '::guest';
              try { if (LSRef) _remove.call(LSRef, gKey); } catch (_) {}
              try { if (SSRef) _remove.call(SSRef, gKey); } catch (_) {}
              try { nameRemove(gKey); } catch (_) {}
              try { if (Object.prototype.hasOwnProperty.call(mem, gKey)) delete mem[gKey]; } catch (_) {}
            }
          }
        } catch (_) {}
      };

      if (typeof _key === "function") {
        SP.key = function (index) {
          try {
            return _key.call(this, index);
          } catch (_) {
            try {
              const keys = Object.keys(mem);
              return keys[index] || null;
            } catch { return null; }
          }
        };
      }

      if (typeof _clear === "function") {
        SP.clear = function () {
          try { _clear.call(this); } catch (_) {}
          try {
            Object.keys(mem).forEach((k) => { delete mem[k]; });
          } catch (_) {}
          try { nameClear(); } catch(_) {}
        };
      }
    }
  } catch (_) {
    // If even accessing Storage prototype fails, continue with pure in-memory fallback below
  }

  function tryGet(storage, key) {
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  }
  function trySet(storage, key, value) {
    try {
      storage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }
  function tryRemove(storage, key) {
    try {
      storage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  const StorageUtil = {
    get(key) {
      // Prefer localStorage, then sessionStorage, then memory
      const vLocal = tryGet(getLS(), key);
      if (vLocal != null && vLocal !== "") return vLocal;
      const vSession = tryGet(getSS(), key);
      if (vSession != null && vSession !== "") return vSession;
      const vName = nameGet(key);
      if (vName != null && vName !== "") return vName;
      return Object.prototype.hasOwnProperty.call(mem, key) ? mem[key] : null;
    },

    set(key, value) {
      const str = String(value);
      if (!trySet(getLS(), key, str)) {
        if (!trySet(getSS(), key, str)) {
          mem[key] = str;
        }
      }
      // Mirror to name store regardless, to enable file:// cross-page reads
      nameSet(key, str);
    },

    remove(key) {
      const okLocal = tryRemove(getLS(), key);
      const okSession = tryRemove(getSS(), key);
      if (Object.prototype.hasOwnProperty.call(mem, key)) delete mem[key];
      try { nameRemove(key); } catch {}
      return okLocal || okSession;
    },

    getJSON(key, fallback = null) {
      try {
        const raw = this.get(key);
        if (raw == null || raw === "") return fallback;
        const parsed = JSON.parse(raw);
        return parsed == null ? fallback : parsed;
      } catch {
        return fallback;
      }
    },

    setJSON(key, value) {
      const str = JSON.stringify(value);
      if (!trySet(getLS(), key, str)) {
        if (!trySet(getSS(), key, str)) {
          mem[key] = str;
        }
      }
      nameSet(key, str);
    },

    getInt(key, fallback = 0) {
      try {
        const raw = this.get(key);
        const n = parseInt(raw || "", 10);
        return Number.isFinite(n) ? n : fallback;
      } catch {
        return fallback;
      }
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
