import { useRef } from 'react';

export function c(size) {
  const cacheRef = useRef(Array(size));

  if (cacheRef.current.length !== size) {
    cacheRef.current = Array(size);
  }

  return cacheRef.current;
}
