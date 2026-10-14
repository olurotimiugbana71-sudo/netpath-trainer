// src/hooks/useLocalStorage.ts

import { useEffect, useState } from 'react';

/**
 * A useState-like hook that persists its value to localStorage.
 * Safely degrades if localStorage is unavailable (private mode, quota exceeded, etc.).
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return initialValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(
        `useLocalStorage: failed to read key "${key}". Using initial value.`,
        error
      );
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(
        `useLocalStorage: failed to write key "${key}". Progress may not persist.`,
        error
      );
    }
  }, [key, value]);

  return [value, setValue];
}