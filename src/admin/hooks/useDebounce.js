import { useState, useEffect } from 'react';

/**
 * Debounce hook — retrasa la actualización de un valor
 * Ideal para búsquedas en tiempo real
 * 
 * @param {any} value - Valor a debouncear
 * @param {number} delay - Delay en ms (default: 300)
 * @returns {any} - Valor debounceado
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
