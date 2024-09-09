export function useDomMethods() {
  /**
   * Runs Element.closest on a given node, handling text nodes by delegating to a parent.
   * @param node The element to check for a closest element
   * @param selector The CSS selector to check
   * @returns The closest Element that matches the selector
   */
  function closest(node: Node, selector: string) {
    const target = "closest" in node ? node as HTMLElement : node.parentElement;
    return target?.closest(selector);
  }

  return {
    closest
  };
}