export function useDomMethods() {
  /**
   * Runs Element.closest on a given node, handling text nodes by delegating to a parent.
   * @param {Element} node The element to check for a closest element
   * @param {String} selector The CSS selector to check
   * @param {Element} The closest Element that matches the selector
   */
  function closest(node, selector) {
    const target = node.closest ? node : node.parentElement;
    return target.closest(selector);
  }

  return {
    closest
  };
}