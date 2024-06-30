export const isArraysEqualByValue = <T extends Record<string, unknown>>(
  arr1: Array<T>,
  arr2: Array<T>,
): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i += 1) {
    const keys1 = Object.keys(arr1[i]);
    const keys2 = Object.keys(arr2[i]);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let j = 0; j < keys1.length; j += 1) {
      if (arr1[i][keys1[j]] !== arr2[i][keys2[j]]) {
        return false;
      }
    }
  }

  return true;
};
