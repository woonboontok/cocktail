/* Accessible modal behavior shared by the recipe and inventory dialogs. */
(function (root) {
  "use strict";
  const focusReturns = new WeakMap();

  function showModal(backdrop, focusSelector) {
    if (!backdrop) return;
    if (!backdrop.classList.contains("open")) {
      focusReturns.set(backdrop, document.activeElement);
    }
    backdrop.inert = false;
    backdrop.setAttribute("aria-hidden", "false");
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    const target = focusSelector ? backdrop.querySelector(focusSelector) : backdrop.querySelector("button, input, select, textarea");
    if (target) target.focus();
  }

  function hideModal(backdrop) {
    if (!backdrop) return;
    backdrop.classList.remove("open");
    backdrop.setAttribute("aria-hidden", "true");
    backdrop.inert = true;
    const previous = focusReturns.get(backdrop);
    focusReturns.delete(backdrop);
    if (previous && previous.isConnected) previous.focus();
    else document.querySelector(".nav-btn[aria-current='page']")?.focus();
    if (!document.querySelector(".modal-backdrop.open")) document.body.style.overflow = "";
  }

  function keepFocusInOpenModal(event) {
    const openModals = document.querySelectorAll(".modal-backdrop.open");
    const backdrop = openModals[openModals.length - 1];
    if (!backdrop) return;
    const focusable = [...backdrop.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter(element => !element.hidden && element.getAttribute("aria-hidden") !== "true" && element.getClientRects().length > 0);
    if (!focusable.length) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !backdrop.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !backdrop.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  }

  root.BoonBarModal = { showModal, hideModal, keepFocusInOpenModal };
  if (typeof module !== "undefined" && module.exports) module.exports = root.BoonBarModal;
})(typeof window !== "undefined" ? window : globalThis);
