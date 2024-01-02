/**
 * Recursively merges properties of multiple source objects into a target object.
 * @param {Object} target - The target object to merge properties into.
 * @param {...Object} sources - The source objects containing properties to merge.
 */
function deepMerge(target, ...sources) {
  for (const source of sources) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (source[key] instanceof Object && !Array.isArray(source[key])) {
          // If the target does not have the key, create an empty object.
          if (!target[key]) {
            target[key] = {};
          }
          // Recursively merge the inner objects.
          deepMerge(target[key], source[key]);
        } else if (Array.isArray(source[key])) {
          // Concatenate arrays if the key already exists in the target.
          target[key] = (target[key] || []).concat(source[key]);
        } else {
          // Assign the value directly if not an object or an array.
          target[key] = source[key];
        }
      }
    }
  }
}

/**
 * Merges multiple objects into a single new object, recursively combining their properties.
 * @param {...Object} objects - The objects to merge.
 * @returns {Object} - A new object containing merged properties from all input objects.
 */
export function merge(...objects) {
  // Create an empty target object.
  const mergedObject = {};
  // Call the deepMerge function to merge properties.
  deepMerge(mergedObject, ...objects);
  // Return the merged object.
  return mergedObject;
}
