/* Safe Web Storage adapter with a per-session fallback for restricted browsers. */
(function (root) {
  "use strict";

  function create({ getStorage, onUnavailable } = {}) {
    const memory = new Map();
    const removed = new Set();
    const failures = new Set();
    const failedPersistence = new Set();

    function reportUnavailable(operation, key, error) {
      const wasAvailable = failures.size === 0;
      failures.add(`${operation}:${key}`);
      if (wasAvailable && typeof onUnavailable === "function") {
        try { onUnavailable({ operation, key, error }); }
        catch (callbackError) { console.warn("Storage failure notification failed", callbackError); }
      }
    }

    function clearFailures(...tokens) {
      tokens.forEach(token => failures.delete(token));
    }

    function clearKeyFailures(key) {
      clearFailures(`read:${key}`, `write:${key}`, `remove:${key}`);
    }

    function getItem(key) {
      if (memory.has(key)) return memory.get(key);
      if (removed.has(key)) return null;
      try {
        const storage = typeof getStorage === "function" ? getStorage() : null;
        if (!storage) throw new Error("Browser storage is unavailable");
        const value = storage.getItem(key);
        clearFailures(`read:${key}`);
        return value;
      } catch (error) {
        reportUnavailable("read", key, error);
        return null;
      }
    }

    function setItem(key, value) {
      const serialized = String(value);
      try {
        const storage = typeof getStorage === "function" ? getStorage() : null;
        if (!storage) throw new Error("Browser storage is unavailable");
        storage.setItem(key, serialized);
        memory.delete(key);
        removed.delete(key);
        clearKeyFailures(key);
        failedPersistence.delete(key);
        return true;
      } catch (error) {
        memory.set(key, serialized);
        removed.delete(key);
        failedPersistence.add(key);
        reportUnavailable("write", key, error);
        return false;
      }
    }

    function removeItem(key) {
      try {
        const storage = typeof getStorage === "function" ? getStorage() : null;
        if (!storage) throw new Error("Browser storage is unavailable");
        storage.removeItem(key);
        memory.delete(key);
        removed.delete(key);
        clearKeyFailures(key);
        failedPersistence.delete(key);
        return true;
      } catch (error) {
        memory.delete(key);
        removed.add(key);
        failedPersistence.add(key);
        reportUnavailable("remove", key, error);
        return false;
      }
    }

    function isPersistent() {
      return failedPersistence.size === 0;
    }

    return { getItem, setItem, removeItem, isPersistent };
  }

  root.BoonBarAppStorage = { create };
  if (typeof module !== "undefined" && module.exports) module.exports = root.BoonBarAppStorage;
})(typeof window !== "undefined" ? window : globalThis);
