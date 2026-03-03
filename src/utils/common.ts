// src/utils/common.ts

// Parses a price string (e.g., "$19.99") and returns the numeric value (e.g., 19.99)
export function parsePrice(text: string): number {
  const cleaned = text.replace(/[^0-9.]/g, '');
  const parsed = Number(cleaned);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Cannot parse price from: "${text}"`);
  }

  return parsed;
}

// Checks if the array is sorted in ascending order based on the provided key function
export function isSortedAsc<T>(arr: T[], keyFn?: (x: T) => string | number): boolean {
  const key = keyFn ?? ((x: T) => x as unknown as string | number);

  for (let i = 1; i < arr.length; i++) {
    if (key(arr[i - 1]) > key(arr[i])) return false;
  }

  return true;
}

// Checks if the array is sorted in descending order based on the provided key function
export function isSortedDesc<T>(arr: T[], keyFn?: (x: T) => string | number): boolean {
  const key = keyFn ?? ((x: T) => x as unknown as string | number);

  for (let i = 1; i < arr.length; i++) {
    if (key(arr[i - 1]) < key(arr[i])) return false;
  }

  return true;
}
