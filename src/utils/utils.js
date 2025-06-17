// Utility to format time in mm:ss
export const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

export const getThreeSequenceElements = (array, index) => {
  if (!Array.isArray(array) || array.length < 3) {
    throw new Error("Input array must have at least 3 elements.");
  }

  const arrayLength = array.length;

  // Adjust the index range for consistent behavior
  if (index < 1) {
    index = 1;
  } else if (index > arrayLength - 2) {
    index = arrayLength - 2;
  }

  return [array[index - 1], array[index], array[index + 1]];
};

export const getThreeElementsAfterIndex = (array, index) => {
  if (!Array.isArray(array) || array.length < 3) {
    throw new Error("Input array must have at least 3 elements.");
  }

  // Ensure the index is valid
  if (index < 0 || index >= array.length) {
    throw new Error("Index is out of bounds.");
  }

  const result = [];

  // Add the current index itself
  result.push(array[index]);

  // Add up to 2 elements after the index
  for (let i = 1; i < 3; i++) {
    if (index + i < array.length) {
      result.push(array[index + i]);
    }
  }

  // If the result has fewer than 3 elements, prepend earlier elements
  for (let i = 1; result.length < 3; i++) {
    if (index - i >= 0) {
      result.unshift(array[index - i]);
    }
  }

  return result;
};
export const getThreeElementsBeforeIndex = (array, index) => {
  if (!Array.isArray(array) || array.length < 3) {
    throw new Error("Input array must have at least 3 elements.");
  }

  // Ensure the index is valid
  if (index < 0 || index >= array.length) {
    throw new Error("Index is out of bounds.");
  }

  // Calculate the start and end indices for slicing
  const start = Math.max(0, index - 3);
  const result = array.slice(start, index);

  // If the result has fewer than 3 elements, pad it with earlier elements
  while (result.length < 3) {
    result.push(array[result.length]); // Add elements from the beginning
  }

  return result;
};
