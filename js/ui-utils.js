/* Small safe rendering helpers shared by dynamic views. */
(function (root) {
  "use strict";

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  root.BoonBarUIUtils = { escapeHTML };
  if (typeof module !== "undefined" && module.exports) module.exports = root.BoonBarUIUtils;
})(typeof window !== "undefined" ? window : globalThis);
