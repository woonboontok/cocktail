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

  function normalizeSearchText(value) {
    if (!value) return "";
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/œ/g, "oe")
      .replace(/æ/g, "ae")
      .replace(/ß/g, "ss");
  }

  function announceStatus(message) {
    const region = document.getElementById("app-status");
    if (!region) return;
    region.textContent = "";
    root.setTimeout(() => { region.textContent = String(message); }, 20);
  }

  root.BoonBarUIUtils = { escapeHTML, normalizeSearchText, announceStatus };
  if (typeof module !== "undefined" && module.exports) module.exports = root.BoonBarUIUtils;
})(typeof window !== "undefined" ? window : globalThis);
