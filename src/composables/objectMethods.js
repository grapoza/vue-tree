export function useObjectMethods() {
  /**
   * Gives a pretty good indication of objectness
   * @param {Object} obj The thing to check for objectness
   * @returns {boolean} True if this is probably an Object, false otherwise
   */
  function isProbablyObject(obj) {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
  };

  /**
   * Deeply (or deeply enough) copies the given object into a new object.
   * Note that this is "cheap" as in budget-value, not efficiency.
   * @param {Object} toCopy The object to copy
   * @returns {Object} The copy
   */
  function cheapCopyObject(toCopy) {

    // Use a copy of the source, since the props can be fubar'd by the assigns
    let target = JSON.parse(JSON.stringify(toCopy));

    if (isProbablyObject(target)) {
      for (const propName of Object.keys(toCopy)) {
        let srcProp = toCopy[propName];

        if (typeof srcProp === 'function') {
          // Functions are lost on the JSON copy, so snag the original.
          target[propName] = srcProp;
        }
        else if (isProbablyObject(srcProp)) {
          // Find object properties to deep assign them
          target[propName] = cheapCopyObject(srcProp);
        }
      }
    }

    return target;
  };

  return { isProbablyObject, cheapCopyObject };
}